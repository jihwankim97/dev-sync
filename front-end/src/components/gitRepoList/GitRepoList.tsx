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

const GitRepoList = ({
  result,
  onSelectionChange,
}: {
  result: GitHubRepoData[];
  onSelectionChange: (
    selected: {
      name: string;
      selected: boolean;
      commits: { message: string; selected: boolean }[];
      pullRequests: { title: string; selected: boolean }[];
    }[]
  ) => void;
}) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    {
      name: string;
      selected: boolean;
      showCommits: boolean;
      commits: { message: string; selected: boolean }[];
      pullRequests: { title: string; selected: boolean }[];
    }[]
  >([]);

  console.log(result);

  useEffect(() => {
    setSelectedItems(
      result.map((item) => ({
        name: item.name,
        selected: true,
        showCommits: false,
        commits: item.activity.commits.map((commit) => ({
          message: commit.message,
          selected: true,
        })),
        pullRequests: item.activity.pull_requests.map((pullRequest) => ({
          title: pullRequest.title,
          selected: true,
        })),
      }))
    );
  }, [result]);

  useEffect(() => {
    const filteredSelection = selectedItems.map((item) => ({
      name: item.name,
      selected: item.selected,
      commits: item.commits
        .filter((commit) => commit.selected)
        .map(({ message }) => ({ message })),
    }));
    // onSelectionChange(filteredSelection);
  }, [selectedItems, onSelectionChange]);

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
    repoIndex: number,
    itemIndex: number
  ) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex
          ? {
              ...item,
              [type]: item[type].map((entry, idx) =>
                idx === itemIndex
                  ? { ...entry, selected: !entry.selected }
                  : entry
              ),
            }
          : item
      )
    );
  };

  const handleDescriptionChange = (
    type: "commits" | "pullRequests",
    repoIndex: number,
    commitIndex: number,
    message: string
  ) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex
          ? {
              ...item,
              [type]: item[type].map((commit, idx) =>
                idx === commitIndex
                  ? {
                      ...commit,
                      [type === "commits" ? "message" : "title"]: message,
                    }
                  : commit
              ),
            }
          : item
      )
    );
  };

  const toggleCommitsVisibility = (repoIndex: number) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex ? { ...item, showCommits: !item.showCommits } : item
      )
    );
  };

  const handleRepoCheckChange = (repoIndex: number) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex
          ? {
              ...item,
              selected: !item.selected,
              commits: item.commits.map((commit) => ({
                ...commit,
                selected: !item.selected, // 상위 선택 상태에 따라 변경
              })),
              pullRequests: item.pullRequests.map((pr) => ({
                ...pr,
                selected: !item.selected,
              })),
            }
          : item
      )
    );
  };

  return (
    <div css={containerStyle}>
      {selectedItems.map((repo, repoIndex) => (
        <div key={repoIndex}>
          <div
            css={itemStyle}
            className={visibleIndexes.includes(repoIndex) ? "visible" : ""}
          >
            <Checkbox
              onChange={() => handleRepoCheckChange(repoIndex)}
              checked={repo.selected}
            />
            <Typography>{repo.name}</Typography>
            <Button
              onClick={() => toggleCommitsVisibility(repoIndex)}
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
                        handleCheckboxChange("commits", repoIndex, commitIndex)
                      }
                      checked={commit.selected}
                    />
                    <TextareaAutosize
                      css={textareaStyle}
                      minRows={2}
                      placeholder="커밋 내용에 대해 추가해보세요."
                      value={commit.message}
                      onChange={(e) =>
                        handleDescriptionChange(
                          "commits",
                          repoIndex,
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
                        handleCheckboxChange("pullRequests", repoIndex, prIndex)
                      }
                      checked={pullRequest.selected}
                    />
                    <TextareaAutosize
                      css={textareaStyle}
                      minRows={2}
                      value={pullRequest.title}
                      onChange={(e) =>
                        handleDescriptionChange(
                          "pullRequests",
                          repoIndex,
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
