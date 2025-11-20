import { css } from "@emotion/react";
import { Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GitRepoList from "../../components/gitRepoList/GitRepoList";
import type { ResumeContextType } from "../../layout/resume/ResumeSetupLayout ";
import { useDispatch } from "react-redux";
import { setResume } from "../../redux/resumeSlice";
import { GitHubRepoData } from "../../types/github.resume";
export const GitConnectPage = () => {
  const {
    repoData,

    selectedRepos,
    setSelectedRepos,
    setIsLoading,
    setRepoData,
    isLoading,
  } = useOutletContext<ResumeContextType>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelectionChange = useCallback(
    (
      updatedSelection: {
        name: string;
        selected: boolean;
        commits: { message: string; selected: boolean }[];
        pullRequests: { title: string; selected: boolean }[];
      }[]
    ) => {
      setSelectedRepos(updatedSelection);
    },
    []
  );

  // console.log(repoData);
  const generateResume = async (repoData: GitHubRepoData[]) => {
    const filteredRepos = repoData.filter((repo) => repo.selected);
    // console.log(filteredRepos);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/resumes/generate", {
        method: "POST",
        credentials: "include", // 세션 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData: filteredRepos }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      console.log("Generated Resume Data:", result);
      navigate(`/resume/${result.id}/editor`);
      dispatch(setResume(result));
    } catch (error) {
      console.error("Error generating resume:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // repoData가 없을 경우에만 복구
    if (repoData.length === 0) {
      const saved = sessionStorage.getItem("repoData");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRepoData(parsed);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin-top: 3%;
        `}
      >
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <>
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
    </>
  );
};
