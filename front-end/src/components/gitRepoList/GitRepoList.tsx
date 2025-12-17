/** @jsxImportSource @emotion/react */
import { Button, Checkbox, TextareaAutosize, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  commitAreaStyle,
  commitContainerStyle,
  commitStyle,
  containerStyle,
  itemStyle,
  textareaStyle,
} from "./GitRepoList.styles";
import { GitHubRepoData } from "../../types/github.resume";

type RepoLookup = {
  [repoName: string]: {
    selected: boolean;
    showCommits: boolean;
    commits: { message: string; selected: boolean }[];
    pullRequests: { title: string; selected: boolean }[];
  };
};

const GitRepoList = ({
  result,
  selectedItems,
  setSelectedItems,
}: {
  result: GitHubRepoData[];
  selectedItems: RepoLookup;
  setSelectedItems: React.Dispatch<React.SetStateAction<RepoLookup>>;
}) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItems(
      result.reduce((acc, repo) => {
        acc[repo.name] = {
          selected: true,
          showCommits: false,
          commits: repo.activity.commits.map((c) => ({
            message: c.message,
            selected: true,
          })),
          pullRequests: repo.activity.pull_requests.map((p) => ({
            title: p.title,
            selected: true,
          })),
        };
        return acc;
      }, {} as RepoLookup)
    );
  }, [result]);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    result.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, index]);
      }, index * 100); // 순차적 애니메이션
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [result]);

  const handleCheckboxChange = (
    type: "commits" | "pullRequests",
    repoName: string,
    itemIndex: number
  ) => {
    setSelectedItems((prev) => {
      const repo = prev[repoName];

      const updatedList = repo[type].map((item, idx) =>
        idx === itemIndex ? { ...item, selected: !item.selected } : item
      );

      return {
        ...prev,
        [repoName]: {
          ...repo,
          [type]: updatedList,
        },
      };
    });
  };

  const handleDescriptionChange = (
    type: "commits" | "pullRequests",
    repoName: string,
    itemIndex: number,
    message: string
  ) => {
    setSelectedItems((prev) => {
      const repo = prev[repoName];

      const updatedList = repo[type].map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              [type === "commits" ? "message" : "title"]: message,
            }
          : item
      );

      return {
        ...prev,
        [repoName]: {
          ...repo,
          [type]: updatedList,
        },
      };
    });
  };

  const toggleCommitsVisibility = (repoName: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [repoName]: {
        ...prev[repoName],
        showCommits: !prev[repoName].showCommits,
      },
    }));
  };

  const handleRepoCheckChange = (name: string) => {
    setSelectedItems((prev) => {
      const repo = prev[name];
      const newSelected = !repo.selected;

      return {
        ...prev,
        [name]: {
          ...repo,
          selected: newSelected,
          commits: repo.commits.map((c) => ({ ...c, selected: newSelected })),
          pullRequests: repo.pullRequests.map((pr) => ({
            ...pr,
            selected: newSelected,
          })),
        },
      };
    });
  };

  return (
    <div css={containerStyle}>
      {Object.entries(selectedItems).map(([repoName, repo], repoIndex) => (
        <div key={repoIndex}>
          <div
            css={itemStyle}
            className={visibleIndexes.includes(repoIndex) ? "visible" : ""}
          >
            <Checkbox
              onChange={() => handleRepoCheckChange(repoName)}
              checked={repo.selected}
            />
            <Typography>{repoName}</Typography>
            <Button
              onClick={() => toggleCommitsVisibility(repoName)}
              variant="outlined"
              size="small"
            >
              {repo.showCommits ? "Hide Commits" : "Show Commits"}
            </Button>
          </div>
          {repo.showCommits && (
            <div css={commitAreaStyle}>
              <div css={commitContainerStyle}>
                {repo.commits.map((commit, commitIndex) => (
                  <div key={commitIndex} css={commitStyle}>
                    <Checkbox
                      onChange={() =>
                        handleCheckboxChange("commits", repoName, commitIndex)
                      }
                      checked={commit.selected}
                    />
                    <TextareaAutosize
                      css={[
                        textareaStyle,
                        !commit.selected && {
                          backgroundColor: "#f0f0f0",
                        },
                      ]}
                      disabled={!commit.selected}
                      minRows={2}
                      placeholder="커밋 내용에 대해 추가해보세요."
                      value={commit.message}
                      onChange={(e) =>
                        handleDescriptionChange(
                          "commits",
                          repoName,
                          commitIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                {repo.pullRequests.map((pullRequest, prIndex) => (
                  <div key={prIndex} css={commitStyle}>
                    <Checkbox
                      onChange={() =>
                        handleCheckboxChange("pullRequests", repoName, prIndex)
                      }
                      checked={pullRequest.selected}
                    />
                    <TextareaAutosize
                      css={[
                        textareaStyle,
                        !pullRequest.selected && {
                          backgroundColor: "#f0f0f0",
                        }, // 비활성화 시 스타일
                      ]}
                      minRows={2}
                      disabled={!pullRequest.selected}
                      value={pullRequest.title}
                      onChange={(e) =>
                        handleDescriptionChange(
                          "pullRequests",
                          repoName,
                          prIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GitRepoList;
