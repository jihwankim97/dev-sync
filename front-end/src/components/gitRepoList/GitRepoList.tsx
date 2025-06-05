/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { Checkbox, Typography, TextareaAutosize, Button } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  containerStyle,
  itemStyle,
  commitAreaStyle,
  commitContainerStyle,
  commitStyle,
  commitHeaderStyle,
  textareaStyle,
} from "./GitRepoList.styles";

const GitRepoList = ({
  result,
  onSelectionChange,
}: {
  result: {
    name: string;
    recent_commit_messages: string[];
    commits: { message: string; description: string };
  }[];
  onSelectionChange: (
    selected: {
      name: string;
      selected: boolean;
      commits: { message: string; description: string }[];
    }[]
  ) => void;
}) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    {
      name: string;
      selected: boolean;
      showCommits: boolean;
      commits: { message: string; description: string; selected: boolean }[];
    }[]
  >([]);

  useEffect(() => {
    setSelectedItems(
      result.map((item) => ({
        name: item.name,
        selected: true,
        showCommits: false,
        commits: item.recent_commit_messages.map((message, index) => ({
          message,
          description: "",
          selected: index < 10, // 처음 10개 선택
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
        .map(({ message, description }) => ({ message, description })),
    }));
    onSelectionChange(filteredSelection);
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

  const handleCheckboxChange = (repoIndex: number) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCommitCheckboxChange = (
    repoIndex: number,
    commitIndex: number
  ) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex
          ? {
              ...item,
              commits: item.commits.map((commit, idx) =>
                idx === commitIndex
                  ? { ...commit, selected: !commit.selected }
                  : commit
              ),
            }
          : item
      )
    );
  };

  const handleDescriptionChange = (
    repoIndex: number,
    commitIndex: number,
    description: string
  ) => {
    setSelectedItems((prev) =>
      prev.map((item, index) =>
        index === repoIndex
          ? {
              ...item,
              commits: item.commits.map((commit, idx) =>
                idx === commitIndex ? { ...commit, description } : commit
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

  return (
    <div css={containerStyle}>
      {selectedItems.map((repo, repoIndex) => (
        <div key={repoIndex}>
          <div
            css={itemStyle}
            className={visibleIndexes.includes(repoIndex) ? "visible" : ""}
          >
            <Checkbox
              onChange={() => handleCheckboxChange(repoIndex)}
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
                    <div css={commitHeaderStyle}>
                      {/* <DescriptionIcon fontSize="small" /> */}
                      <Checkbox
                        onChange={() =>
                          handleCommitCheckboxChange(repoIndex, commitIndex)
                        }
                        checked={commit.selected}
                      />
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {commit.message}
                      </Typography>
                    </div>
                    <TextareaAutosize
                      css={textareaStyle}
                      minRows={2}
                      placeholder="커밋 내용에 대해 추가해보세요."
                      value={commit.description}
                      onChange={(e) =>
                        handleDescriptionChange(
                          repoIndex,
                          commitIndex,
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
