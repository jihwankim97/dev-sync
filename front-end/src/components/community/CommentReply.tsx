import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { Button, css, Divider, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSendComment } from "../../api/mutations/userMutations";

export const CommentReply = ({
  parentId,
  setReplying,
}: {
  parentId: number;
  setReplying: Dispatch<
    SetStateAction<{ isReplying: boolean; parent_id: number }>
  >;
}) => {
  const location = useLocation();
  const postId = location.state.id; // `navigate`에서 전달된 데이터
  const textRef = useRef<HTMLInputElement | null>(null);

  const sendComment = useSendComment();

  const onChangeTextField = () => {
    const commentText = textRef.current?.value?.trim();
    if (!commentText) return;

    // 댓글 추가 mutation 실행
    sendComment.mutate(
      {
        postId,
        value: commentText,
        parentId,
      },
      {
        onSuccess: () => {
          setReplying({ isReplying: false, parent_id: 0 });
          // 성공 시에만 댓글 입력 UI 닫기
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);
        },
      }
    );
  };

  return (
    <div
      css={css`
        background-color: rgba(255, 255, 255, 0.557);
      `}
    >
      <div
        css={css`
          padding: 1rem 1.5rem 0 1.5rem;
          // justify-content: center;
          display: flex;
        `}
      >
        <SubdirectoryArrowRightIcon />
        <div
          css={css`
            width: 100%;
            padding-left: 1rem;
          `}
        >
          <TextField
            hiddenLabel
            inputRef={textRef}
            variant="outlined"
            css={css`
              width: 100%;
              background-color: #ffffff;
              font-size: 12px;
              height: 100%;
              overflow-y: auto;
            `}
            multiline
            maxRows={20}
          />
        </div>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin: 0.5rem 1.5rem;
          gap: 0.3rem;
        `}
      >
        <Button variant="contained" onClick={onChangeTextField}>
          입력
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setReplying({ isReplying: false, parent_id: 0 });
          }}
        >
          취소
        </Button>
      </div>
      <Divider />
    </div>
  );
};
