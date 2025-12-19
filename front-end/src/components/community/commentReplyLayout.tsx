import { css } from "@emotion/react";
import { Avatar } from "@mui/material";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import { memo, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { openLoginForm } from "../../redux/loginSlice";
import { RootState } from "../../redux/store";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { OptionBar } from "./OptionBar";
import {
  useEditComment,
  useRemoveComment,
} from "../../api/mutations/communityMutations";
import { useQuery } from "@tanstack/react-query";
import { userDataOption } from "../../api/queries/userQueries";
import { Comment } from "../../types/feed.type";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CommentReply } from "./CommentReply";
import {
  buttonStyles,
  dividerStyles,
  textAreaStyles,
  whiteButtonStyle,
} from "../../styles/resumeCommonStyle";
import { postKeys } from "../../api/queryKeys";
import { ENDPOINTS } from "../../api/endpoint";
import { request } from "../../api/queries/baseQuery";

export type CommentGroup = Comment & {
  replies: CommentGroup[];
  comment_id?: string;
};

export const CommentReplyLayout = memo(
  ({
    comment,
    page,
    setEditTargetId,
    editTargetId,
  }: {
    comment: Comment;
    page: number;
    setEditTargetId: React.Dispatch<React.SetStateAction<number | null>>;
    editTargetId: number | null;
  }) => {
    const location = useLocation();
    const postId = location.state.id; // `navigate`에서 전달된 데이터
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const isLogin = useSelector((state: RootState) => state.login.loggedIn);
    const dispatch = useDispatch();
    const [replying, setReplying] = useState<{
      isReplying: boolean;
      id: number;
    }>({
      isReplying: false,
      id: 0,
    });
    const [addReply, setAddReply] = useState<boolean>(false);
    const { data: userData } = useQuery(userDataOption());
    if (!comment) return null;
    const removeComment = useRemoveComment(comment.id, postId, page);
    const editComment = useEditComment(comment.id, postId, page);

    const { data: repliesData, isSuccess } = useQuery({
      queryKey: postKeys.commentReply(comment.id, page),
      queryFn: () =>
        request({
          url: ENDPOINTS.commentReply(comment.id),
          method: "GET",
        }),
      enabled: replying.isReplying && replying.id === comment.id,
    });

    console.log(repliesData);

    const handleDeleteComment = () => {
      removeComment.mutate();
    };

    const handleEdit = () => {
      setEditTargetId(comment.id);
    };

    const isEditing = editTargetId === comment.id;

    const handleEditSave = () => {
      const content = textRef.current?.value ?? "";
      if (content.trim()) {
        editComment.mutate(content);
        setEditTargetId(null);
      }
    };

    // 초기 렌더 시 textarea 내용에 맞춰 높이 조정
    useEffect(() => {
      const el = textRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [isEditing]);

    const handleReply = () => {
      if (!isLogin) {
        dispatch(openLoginForm()); // 로그인되지 않았다면 로그인 폼 열기
      } else {
        setAddReply(!addReply);
        setReplying({ ...replying, id: comment.id });
      }
    };

    return (
      <>
        <div
          css={css`
            padding: 0.8rem;
            font-size: 15px;
            background-color: rgba(255, 255, 255, 0.557);
            display: flex;
          `}
        >
          {comment.parent && (
            <div
              css={css`
                color: #c0c0c0ff;
                margin-right: 5px;
              `}
            >
              <SubdirectoryArrowRightIcon />
            </div>
          )}

          <div
            css={css`
              width: 100%;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <div
                css={css`
                  display: flex;
                  margin-bottom: 5px;
                `}
              >
                <Avatar
                  src={
                    comment.profile_image ? comment.profile_image : undefined
                  }
                  sx={{ width: 38, height: 38 }}
                />
                <div
                  css={css`
                    padding: 5px;
                    line-height: 15px;
                  `}
                >
                  <div
                    css={css`
                      font-size: 14px;
                      color: #4e4e4e;
                      font-weight: bold;
                    `}
                  >
                    <span>{comment.user_name}</span>
                  </div>
                  <div>
                    <span
                      css={css`
                        font-size: 12.5px;
                        color: #7e7e7e;
                        font-weight: 100;
                      `}
                    >
                      {new Date(comment.createdAt).toLocaleString()}{" "}
                      {/* 날짜 변환 */}
                    </span>
                  </div>
                </div>
              </div>
              {comment.user_name === userData?.name && (
                <OptionBar
                  deleteClick={handleDeleteComment}
                  editClick={handleEdit}
                />
              )}
            </div>
            {isEditing ? (
              <div>
                <textarea
                  ref={textRef}
                  defaultValue={comment.comment}
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
                      margin-top: 0.5rem;
                      font-size: 15px;
                    `,
                  ]}
                />
                <div
                  css={css`
                    margin-top: 0.5rem;
                    display: flex;
                    gap: 0.5rem;
                  `}
                >
                  <button
                    type="button"
                    onClick={() => setEditTargetId(null)}
                    css={[
                      buttonStyles("sm"),
                      css`
                        background: transparent;
                        color: #333;
                        border: 1px solid #cfcfcf;
                        &:hover {
                          background: #f5f5f5;
                        }
                      `,
                    ]}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleEditSave}
                    css={[
                      buttonStyles("sm"),
                      css`
                        margin-left: 0.5rem;
                      `,
                    ]}
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  css={css`
                    white-space: pre-line;
                    margin-bottom: 1rem;
                  `}
                >
                  {comment.comment}
                </div>
                {!comment.parent && (
                  <>
                    <button css={whiteButtonStyle} onClick={handleReply}>
                      답글
                    </button>
                  </>
                )}
              </>
            )}
            {comment?.hasReplies && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setReplying({
                      isReplying: !replying.isReplying,
                      id: comment.id,
                    })
                  }
                  css={css`
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0 6px;
                    background-color: #ffffff;
                    font-size: 11px;
                    font-weight: bold;
                    color: #3272a3;
                    height: 25px;
                    border: none;
                    cursor: pointer;
                    &:hover {
                      background-color: #a8cefa55;
                    }
                  `}
                >
                  {replying.isReplying && replying.id === comment.id ? (
                    <KeyboardArrowUpIcon fontSize="medium" color="primary" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="medium" color="primary" />
                  )}
                  {replying.isReplying && replying.id === comment.id
                    ? "답글 닫기"
                    : "답글 열기"}
                </button>
              </>
            )}
          </div>
        </div>
        <hr css={dividerStyles} />
        {replying.isReplying && replying.id === comment.id && isSuccess && (
          <div
            css={css`
              margin-left: 2.5rem;
            `}
          >
            {repliesData.data.map((data: Comment) => {
              return (
                <CommentReplyLayout
                  comment={data}
                  page={page}
                  setEditTargetId={setEditTargetId}
                  editTargetId={editTargetId}
                />
              );
            })}
          </div>
        )}
        {addReply && <CommentReply replying={replying} />}
      </>
    );
  }
);
