/** @jsxImportSource @emotion/react */
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { css } from "@emotion/react";
import { PdfDocument } from "./PdfDocument";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { GitResume } from "./GitResume";
import GitRepoList from "./gitRepoList/GitRepoList";
import { ThreeCanvas } from "./ThreeCanvas";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const containerStyle = css`
  display: flex;
  position: relative;
  flex-direction: column;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const btnStyle = css`
  display: flex;
  justify-content: center;
  z-index: 1;
`;

const titleStyle = css`
  font-size: 3rem;
  span {
    display: block; /* 기본은 inline */
  }
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  font-weight: bold;
  text-align: center;
  z-index: 1;
`;

const subtitleStyle = css`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  z-index: 1;
`;

const responsiveLine = css`
  display: inline;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface Project {
  name: string;
  description: string;
  outcomes: string[];
  role: string;
}

interface GitInfo {
  introduction: {
    description: string;
  };
  projects: Project[];
  skills: {
    knowledgeable: string[];
    strengths: string[];
  };
}

export const GitPatchPage = () => {
  const navigate = useNavigate();
  const [gitBtnClick, setGitBtnClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState<{ name: string }[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<
    { name: string; selected: boolean }[]
  >([]);
  const [gitInfo, setGitInfo] = useState<GitInfo | undefined>();

  const handleSelectionChange = useCallback(
    (
      updatedSelection: {
        name: string;
        selected: boolean;
        commits: { message: string; description: string };
      }[]
    ) => {
      setSelectedRepos(updatedSelection);
    },
    []
  );

  const updateUserData = async () => {
    setRepoData([]); // 레포지토리 배열 초기화
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/resume/get-user-repo", {
      method: "GET",
      credentials: "include", // 세션 쿠키 포함
    });

    if (response.ok) {
      const data = await response.json();
      setRepoData(data); // 받아온 배열 저
      setIsLoading(false);
      // await generateResume(profileData);
    } else {
      const error = await response.json();
      console.error("Update failed:", error);
    }
  };

  const generateResume = async (repoData: any[]) => {
    const filteredRepos = repoData.filter((repo) => repo.selected);

    setIsLoading(true);
    const profileData = filteredRepos
      .map((repo) => {
        const commitDetails = repo.commits
          .map(
            (commit, index) =>
              `- ${commit.message}\n  Description: ${
                commit.description || "No additional details provided"
              }`
          )
          .join("\n");

        return `Repository: ${repo.name}\nDescription: ${
          repo.description || "N/A"
        }\nLanguage: ${repo.language || "N/A"}\nSize: ${repo.size} KB\nStars: ${
          repo.stargazers_count
        }\nForks: ${
          repo.forks_count
        }\nRecent Commit Details:\n${commitDetails}\n`;
      })
      .join("\n");

    try {
      const response = await fetch("http://localhost:3000/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData }),
      });

      const result = await response.json();
      console.log(result);
      setGitInfo(result);
      setGitBtnClick(true);
      navigate("/resume/edit", { state: result });
    } catch (error) {
      console.error("Error generating resume:", error);
    }
    setIsLoading(false);
  };

  const changeNavigate = () => {
    navigate("/");
  };

  return (
    <div css={containerStyle}>
      <div
        css={css`
          position: absolute;
          top: -10vh;
          left: 0;
          width: 100%;
          height: 95vh;
          background: #3599fdff;
          transform: skewY(-5deg);
          z-index: 0;
        `}
      />
      <header
        css={css`
          position: relative;
          display: flex;
          z-index: 0;
          padding-left: 1rem;
          width: 100%;
          justify-content: space-between;
          color: #ffffff;
        `}
      >
        <h2>DevSync</h2>
        <Button
          css={css`
            color: #ffffff;
            margin: 1rem;
          `}
          variant="text"
          onClick={changeNavigate}
        >
          <ArrowBackIcon fontSize="medium" />
        </Button>
      </header>
      {!gitBtnClick && (
        <>
          {/* 버튼 및 상태 표시 */}
          <main>
            <section
              css={css`
                position: relative;
                color: #ffffff;
                margin: 6rem 6rem 4rem 6rem;
                @media (max-width: 768px) {
                  margin: 6rem 1.5rem;
                }
              `}
            >
              <div css={titleStyle}>
                <span>🚀Git 연동을 통해</span>
                <span>&nbsp;포트폴리오를 작성해보세요.</span>
              </div>
              <p css={subtitleStyle}>
                <span>Git 정보를 가져와 자동으로 이력서를 작성하고</span>
                <span>PDF로 저장할 수 있어요.</span>
              </p>
            </section>
            {!isLoading ? (
              <div css={btnStyle}>
                <Button
                  css={css`
                    font-size: 1.2rem;
                    padding: 0.8rem 1.5rem;
                  `}
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={updateUserData}
                >
                  Git 정보 가져오기
                </Button>
              </div>
            ) : (
              <div
                css={css`
                  display: flex;
                  justify-content: center;
                  margin-top: 3%;
                `}
              >
                <CircularProgress size={80} />
              </div>
            )}

            {/* GitRepoList 컴포넌트 */}

            {repoData.length > 0 && (
              <>
                <GitRepoList
                  result={repoData}
                  onSelectionChange={handleSelectionChange}
                />
                <div
                  css={css`
                    width: 59%;
                    justify-content: flex-end;
                    display: flex;
                    margin: 0 auto 5rem auto;
                    position: relative;

                    @media (max-width: 768px) {
                      justify-content: center;
                      margin: 0;
                      width: 100%;
                    }
                  `}
                >
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={() => {
                      generateResume(selectedRepos);
                    }}
                  >
                    이력서 만들기
                  </Button>
                </div>
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
};
