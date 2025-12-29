import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  buttonStyles,
  dividerStyles,
  textAreaStyles,
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
  const mode = useSelector((state: any) => state.theme.mode);
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
          // 부모 댓글 목록도 무효화하여 hasReplies 플래그 업데이트
          queryClient.invalidateQueries({
            queryKey: postKeys.comments(postId, 1),
          });

          // textarea 초기화
          if (textRef.current) {
            textRef.current.value = "";
            textRef.current.style.height = "auto";
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
        background-color: ${mode === "dark"
          ? "rgba(22, 27, 34, 0.4)"
          : "rgba(255, 255, 255, 0.557)"};
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
      </div>
      <hr css={dividerStyles} />
    </div>
  );
};
