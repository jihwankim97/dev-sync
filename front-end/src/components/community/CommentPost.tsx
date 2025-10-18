import { css } from "@emotion/react";
import { Button, TextField } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GetCommentList } from "../../api/GetCommentList";
import { useEvent } from "../../hooks/useEvent";
import { openLoginForm } from "../../redux/loginSlice";
import { CommentGroup } from "./CommentGroup";
import { CommentReplyLayout } from "./commentReplyLayout";
import type { userInfo } from "../../types/resume.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../../api/queryKeys";
import { request } from "../../api/queries/baseQuery";
import { ENDPOINTS } from "../../api/endpoint";
import type { Comment } from "../../types/feed.type";

export const CommentPost = () => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<userInfo>();

  const location = useLocation();
  const postId = location.state.id; // `navigate`에서 전달된 데이터
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const dispatch = useDispatch();
  type RootState = { login: { loggedIn: boolean } };
  const isLogin = useSelector((state: RootState) => state.login.loggedIn);
  // let userId = 0;

  const { data } = useQuery<userInfo>({
    queryKey: [userKeys.user],
    queryFn: () => request({ url: ENDPOINTS.user() }),
  });

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  // if (userData) {
  //   userId = userData.id;
  // }

  useEffect(() => {
    GetCommentList(page, postId, setComments, setTotalPages);
  }, [page, postId]);

  const sendComment = useMutation({
    mutationFn: (value: string) =>
      request({
        url: ENDPOINTS.comment(postId),
        method: "POST",
        body: { parentId: null, comment: value },
      }),
    onSuccess: (data) => {
      console.log("댓글 작성 성공:", data);
    },
  });

  const getComments = useMutation({
    mutationFn: () => {
      const link: string = `${postId}?page=${page}`;
      return request({ url: ENDPOINTS.comment(link) });
    },
    onSuccess: (data) => {
      setComments(data.comments);
      setTotalPages(data.totalCount || 0);
    },
  });

  //댓글 입력시 이벤트 처리
  const eventComment = useEvent(async (value: string) => {
    try {
      const newComment = await sendComment.mutateAsync(value);
      setComments((prev) => [newComment as Comment, ...prev]);
      setPage(1);

      // await getComments.mutateAsync();
      setTimeout(() => getComments.mutateAsync(), 300);
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

  const commentPage = Math.ceil(totalPages / 20);
  const groupComments = CommentGroup(comments);

  return (
    <>
      <div
        css={css`
          padding: 0.8rem 0;
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
          padding: 0rem 0rem;
          display: flex;
          gap: 5px;
        `}
      >
        <TextField
          hiddenLabel
          inputRef={textRef}
          variant="outlined"
          css={css`
            width: 80%;
            background-color: #ffffff;
            font-size: 12px;
          `}
          multiline
          maxRows={10}
        />
        <Button
          variant="contained"
          css={css`
            margin: 7px;
          `}
          disabled={sendComment.isPending}
          onClick={() => {
            handleAddComment();
          }}
        >
          {sendComment.isPending ? "처리중.." : "입력"}
        </Button>
      </div>
      {/* 댓글 그룹화된 데이터 출력 */}
      {groupComments.map((rootComment, index) => (
        <CommentReplyLayout
          key={rootComment.comment_id ?? `comment-${index}`}
          comment={rootComment}
          comments={comments}
          setComments={setComments}
          setPage={setPage}
          setTotalPages={setTotalPages}
          editTargetId={editTargetId}
          setEditTargetId={setEditTargetId}
        />
      ))}
      {totalPages > 0 && (
        <div
          css={css`
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
          `}
        >
          {Array.from({ length: commentPage }, (_, index) => (
            <button
              css={css`
                padding: 0;
                font-size: 14px;
                background-color: #f7f7f8;
                color: ${index + 1 === page ? "#2d5999" : "black"};
              `}
              key={index + 1}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
