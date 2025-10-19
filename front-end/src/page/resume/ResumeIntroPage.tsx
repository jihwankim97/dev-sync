/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ResumeContextType } from "../../layout/resume/ResumeSetupLayout ";

const btnStyle = css`
  display: flex;
  justify-content: center;
  z-index: 10;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0 3rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ResumeIntroPage = () => {
  const { repoData, setRepoData, isLoading, setIsLoading } =
    useOutletContext<ResumeContextType>();
  const navigate = useNavigate();

  const updateUserData = async () => {
    setRepoData([]); // 레포지토리 배열 초기화
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/resumes/github-repos", {
      method: "GET",
      credentials: "include", // 세션 쿠키 포함
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("repoData", JSON.stringify(data));
      setRepoData(data); // 받아온 배열 저
      setIsLoading(false);
      navigate("/resume/connect");
      console.log("성공");
    } else {
      const error = await response.json();
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      {!isLoading ? (
        <div css={btnStyle}>
          <Button
            css={css`
              font-size: 1.2rem;
            `}
            variant="contained"
            color="primary"
            onClick={updateUserData}
          >
            Git 정보 가져오기
          </Button>
          <Button
            css={css`
              font-size: 1.2rem;
            `}
            variant="contained"
            color="primary"
            onClick={() => navigate("/resume/list")}
          >
            기존 이력서 가져오기
          </Button>
        </div>
      ) : isLoading ? (
        <div
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 3%;
          `}
        >
          <CircularProgress size={80} />
        </div>
      ) : null}
    </>
  );
};
