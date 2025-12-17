/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./ContactForm.styles";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const navigate = useNavigate(); 

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // TODO:폼 제출 핸들러 서버 구현하기
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div css={styles.container}>
      <div css={styles.card}>
        <h2 css={styles.title}>문의하기</h2>
        {submitted ? (
          <p css={styles.successMessage}>문의가 성공적으로 접수되었습니다. 감사합니다!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div css={styles.formGroup}>
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div css={styles.formGroup}>
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div css={styles.formGroup}>
              <label>전화번호</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div css={styles.formGroup}>
              <label>제목</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div css={styles.formGroup}>
              <label>문의 내용</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" css={styles.submitButton}>
              제출하기
            </button>
          </form>
        )}
        <button
          css={styles.submitButton} 
          onClick={() => navigate("/contact")}
          style={{ marginTop: "10px", background: "#6c757d" }}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
