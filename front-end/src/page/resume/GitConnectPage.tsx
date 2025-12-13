import { css } from "@emotion/react";
import { Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GitRepoList from "../../components/gitRepoList/GitRepoList";
import type { ResumeContextType } from "../../layout/resume/ResumeSetupLayout ";
import { useDispatch } from "react-redux";
import { setResume } from "../../redux/resumeSlice";
import { GitHubRepoData } from "../../types/github.resume";

type RepoLookup = {
  [repoName: string]: {
    selected: boolean;
    showCommits: boolean;
    commits: { message: string; selected: boolean }[];
    pullRequests: { title: string; selected: boolean }[];
  };
};

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
  const [selectedItems, setSelectedItems] = useState<RepoLookup>({});
  const generateResume = async (selectedItems: RepoLookup) => {
    // 1. 선택된 항목만 필터링하여 updatedResult 계산
    const updatedResult = repoData
      .map((repo) => {
        const repoState = selectedItems[repo.name];
        if (!repoState || !repoState.selected) return null; // 상위 선택 false면 제외

        // commits와 pullRequests에서 selected만 남기고, 수정된 message/title 적용
        const filteredCommits = repo.activity.commits
          .map((commit, idx) => {
            const stateCommit = repoState.commits[idx];
            if (!stateCommit || !stateCommit.selected) return null;
            return { ...commit, message: stateCommit.message };
          })
          .filter(Boolean);

        const filteredPRs = repo.activity.pull_requests
          .map((pr, idx) => {
            const statePR = repoState.pullRequests[idx];
            if (!statePR || !statePR.selected) return null;
            return { ...pr, title: statePR.title };
          })
          .filter(Boolean);

        return {
          ...repo,
          activity: {
            ...repo.activity,
            commits: filteredCommits,
            pull_requests: filteredPRs,
          },
        };
      })
      .filter(Boolean);

    //서버로 요청 전송
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/resumes/generate", {
        method: "POST",
        credentials: "include", // 세션 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData: updatedResult }),
      });

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
      // navigate(`/resume/${result.id}/editor`);
      navigate("/resume/list");
      dispatch(setResume(result));
    } catch (error) {
      console.error("Error generating resume:", error);
    } finally {
      setIsLoading(false);
    }
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
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
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
                generateResume(selectedItems);
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
