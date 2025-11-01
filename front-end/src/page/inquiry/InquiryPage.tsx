import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "../../components/contact/Inquiry.styles";

export interface Inquiry {
  id: number;
  name?: string;
  title?: string;
  isPrivate: boolean;
  createdAt: string;
}

export const InquiryPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    // fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/contact/email/${encodeURIComponent(
          email
        )}?page=1&take=3`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
      }

      const result = await response.json();
      setInquiries(result.data || []);
    } catch (error) {
      console.error("Error:", error);
      alert("문의사항 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={styles.container}>
      <div css={styles.card}>
        <h2 css={styles.title}>내 문의 </h2>
        <div css={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            disabled={loading}
          />
          <button onClick={() => navigate("/inquiry/new")} disabled={loading}>
            문의 하기
          </button>
          <button onClick={fetchInquiries} disabled={loading}>
            {loading ? "조회 중..." : "문의 조회"}
          </button>
        </div>

        {inquiries?.length > 0 ? (
          <ul css={styles.inquiryList}>
            {inquiries.map((inquiry) => (
              <li key={inquiry.id}>
                {inquiry.isPrivate ? (
                  <>
                    <p>비공개 문의사항입니다.</p>
                    <p>
                      작성일: {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <>
                    <p>이름: {inquiry.name}</p>
                    <p>제목: {inquiry.title}</p>
                    <p>
                      작성일: {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>조회된 문의사항이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
