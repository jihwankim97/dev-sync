import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import { openLoginForm } from "../../redux/loginSlice";
import { CommentReplyLayout } from "./commentReplyLayout";
import { useQuery } from "@tanstack/react-query";
import { useSendComment } from "../../api/mutations/userMutations";
import { GetCommentsOption } from "../../api/queries/communityQuerys";
import { buttonStyles, textAreaStyles } from "../../styles/resumeCommonStyle";
import { themeColors } from "../../styles/communityStyles";

export const CommentPost = () => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const location = useLocation();
  const postId = location.state.id; // `navigate`에서 전달된 데이터
  const [page, setPage] = useState(1);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const dispatch = useDispatch();
  type RootState = { login: { loggedIn: boolean }; theme: { mode: string } };
  const isLogin = useSelector((state: RootState) => state.login.loggedIn);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const sendComment = useSendComment();
  const colors = themeColors(mode);
  // 댓글과 총 개수는 React Query의 데이터에서 직접 사용

  const { data: commentsData, refetch } = useQuery({
    ...GetCommentsOption(postId, page),
    staleTime: 0,
  });
  console.log(commentsData);

  const totalPages: number = commentsData?.meta.total ?? 0;

  //댓글 입력시 이벤트 처리
  const eventComment = useEvent(async (value: string) => {
    try {
      await sendComment.mutateAsync({ postId, value, parentId: null, page });
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  const handleAddComment = () => {
    if (!isLogin) {
      dispatch(openLoginForm()); // 로그인되지 않았다면 로그인 폼 열기
    } else {
      if (textRef.current) {
        const textValue = textRef?.current?.value?.trim(); // 앞뒤 공백 제거
        if (textValue) {
          eventComment(textRef?.current?.value);
          //텍스트 필드 값 지우기
          textRef.current!.value = "";
        }
      }
    }
  };

  console.log(commentsData);

  return (
    <div
      css={css`
        margin-left: 1rem;
      `}
    >
      <div
        css={css`
          padding: 1rem 0;
          display: flex;
          font-size: 1.1rem;
        `}
      >
        <div
          css={css`
            color: ${colors.primaryText};
          `}
        >
          댓글
        </div>
        <div
          css={css`
            margin: 0 0.3rem;
            font-weight: bold;
            color: ${colors.accentText};
          `}
        >
          {totalPages}
        </div>
      </div>
      <div
        css={css`
          min-height: fit-content;
          display: flex;
          gap: 15px;
          margin-bottom: 1rem;
        `}
      >
        <textarea
          ref={textRef}
          rows={1}
          onInput={() => {
            const el = textRef.current;
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          css={[
            textAreaStyles,
            css`
              width: 80%;
              font-size: 15px;
              background-color: ${colors.inputBg};
              color: ${colors.primaryText};
              border: 1px solid ${colors.borderColor};
              border-radius: 6px;
              &::placeholder {
                color: ${colors.secondaryText};
              }
              &:focus {
                border-color: ${colors.accentText};
                outline: none;
              }
            `,
          ]}
        />
        <button
          css={css`
            ${buttonStyles("lg")}
            align-self: stretch;
            height: 100%;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: all 0.2s;

            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          `}
          disabled={sendComment.isPending}
          onClick={handleAddComment}
        >
          {sendComment.isPending ? "처리중.." : "입력"}
        </button>
      </div>
      {/* 댓글 그룹화된 데이터 출력 */}
      {commentsData?.data.map((rootComment: any, index: number) => (
        <CommentReplyLayout
          key={rootComment.id ?? `comment-${index}`}
          comment={rootComment}
          page={page}
          editTargetId={editTargetId}
          setEditTargetId={setEditTargetId}
        />
      ))}
      {totalPages > 0 && (
        <div
          css={css`
            margin: 4rem 0;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
          `}
        >
          {Array.from({ length: commentsData?.meta.totalPages }, (_, index) => (
            <button
              css={css`
                padding: 6px 12px;
                font-size: 14px;
                background-color: ${index + 1 === page
                  ? colors.accentText
                  : colors.bgPrimary};
                color: ${index + 1 === page ? "#ffffff" : colors.primaryText};
                border: 1px solid ${colors.borderColor};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: ${index + 1 === page ? 600 : 400};
                &:hover {
                  background-color: ${index + 1 === page
                    ? colors.accentText
                    : colors.bgSecondary};
                }
              `}
              key={index + 1}
              onClick={() => {
                setPage(index + 1);
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
