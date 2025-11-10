import { css } from "@emotion/react";
// import { Button, TextField } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import { openLoginForm } from "../../redux/loginSlice";
import { CommentReplyLayout } from "./commentReplyLayout";
import { useQuery } from "@tanstack/react-query";
import { useSendComment } from "../../api/mutations/userMutations";
import { GetCommentsOption } from "../../api/queries/communityQuerys";
import { buttonStyles, textAreaStyles } from "../../styles/resumeCommonStyle";

export const CommentPost = () => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const location = useLocation();
  const postId = location.state.id; // `navigate`에서 전달된 데이터
  const [page, setPage] = useState(1);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const dispatch = useDispatch();
  type RootState = { login: { loggedIn: boolean } };
  const isLogin = useSelector((state: RootState) => state.login.loggedIn);
  const navigate = useNavigate();
  const sendComment = useSendComment();
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

  // useEffect(() => {
  //   refetch();
  // }, [page]);

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
            color: #565656;
          `}
        >
          댓글
        </div>
        <div
          css={css`
            margin: 0 0.3rem;
            font-weight: bold;
            color: #4363ac;
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
            `,
          ]}
        />
        <button
          css={css`
            ${buttonStyles("lg")}
            align-self: stretch;
            height: 100%;
          `}
          disabled={sendComment.isPending}
          onClick={handleAddComment}
        >
          {sendComment.isPending ? "처리중.." : "입력"}
        </button>
      </div>
      {/* 댓글 그룹화된 데이터 출력 */}
      {commentsData?.data.map((rootComment, index: number) => (
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
                padding: 0;
                font-size: 14px;
                background-color: #f7f7f8;
                color: ${index + 1 === page ? "#2d5999" : "black"};
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
