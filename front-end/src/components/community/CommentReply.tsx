import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { css } from "@emotion/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  buttonStyles,
  dividerStyles,
  textAreaStyles,
  whiteButtonStyle,
} from "../../styles/resumeCommonStyle";
import { useLocation } from "react-router-dom";
import { useSendComment } from "../../api/mutations/userMutations";
import { queryClient } from "../../api/client";
import { postKeys } from "../../api/queryKeys";

export const CommentReply = ({
  replying,
}: {
  replying: { isReplying: boolean; id: number };
}) => {
  const location = useLocation();
  const postId = location.state.id; // `navigate`에서 전달된 데이터
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const sendComment = useSendComment();
  console.log(replying.id);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const onChangeTextField = () => {
    const commentText = textRef.current?.value?.trim();
    if (!commentText) return;

    // 댓글 추가 mutation 실행
    sendComment.mutate(
      {
        postId,
        value: commentText,
        parentId: replying.id,
        page: 1,
      },
      {
        onSuccess: (data, variables) => {
          // 답글 캐시 무효화
          if (variables.parentId) {
            console.log(data, variables);
            queryClient.invalidateQueries({
              queryKey: postKeys.commentReply(
                variables.parentId,
                variables.page
              ),
            });
          }
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
          <textarea
            ref={textRef}
            placeholder="댓글을 입력하세요"
            rows={3}
            onInput={() => {
              const el = textRef.current;
              if (!el) return;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
            css={[
              textAreaStyles,
              css`
                font-size: 15px;
                overflow-y: hidden;
              `,
            ]}
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
        <button type="button" onClick={onChangeTextField} css={buttonStyles()}>
          입력
        </button>
        <button
          type="button"
          onClick={() => {
            // setReplying({ isReplying: false, id: 0 });/
          }}
          css={whiteButtonStyle}
        >
          취소
        </button>
      </div>
      <hr css={dividerStyles} />
    </div>
  );
};
