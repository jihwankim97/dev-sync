import { css } from "@emotion/react";
import { Avatar, TextField, Button, Divider } from "@mui/material";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useQuery } from "@tanstack/react-query";
import { memo, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { EditComment } from "../../api/EditComment";
import { ENDPOINTS } from "../../api/endpoint";
import { GetCommentList } from "../../api/GetCommentList";
import { request } from "../../api/queries/baseQuery";
import { userKeys } from "../../api/queryKeys";
import { RemoveComment } from "../../api/RemoveComment";
import { openLoginForm } from "../../redux/loginSlice";
import { RootState } from "../../redux/store";
import { userInfo } from "../../types/resume.type";
import { CommentReply } from "./CommentReply";
import { OptionBar } from "./OptionBar";

export const CommentReplyLayout = memo(
  ({
    comment,
    setComments,
    comments,
    setPage,
    setTotalPages,
    editTargetId,
    setEditTargetId,
  }: {
    setPage: any;
    comment: any;
    comments: any[];
    setTotalPages: any;
    setComments: React.Dispatch<React.SetStateAction<any[]>>;
    setEditTargetId: React.Dispatch<React.SetStateAction<number | null>>;
    editTargetId: number | null;
  }) => {
    const [userData, setUserData] = useState<userInfo>();
    const userName = userData?.name;
    const location = useLocation();
    const postId = location.state.id; // `navigate`에서 전달된 데이터
    const textRef = useRef<HTMLInputElement | null>(null);
    const isLogin = useSelector((state: RootState) => state.login.loggedIn);
    const dispatch = useDispatch();
    const [replying, setReplying] = useState({
      isReplying: false,
      parent_id: 0,
    });

    const { data } = useQuery<userInfo>({
      queryKey: [userKeys.user],
      queryFn: () => request({ url: ENDPOINTS.user() }),
    });

    useEffect(() => {
      if (data) {
        setUserData(data);
        console.log("data", data);
      }
    }, [data]);

    const handleDeleteComment = async () => {
      await RemoveComment(comment.id);

      await GetCommentList(1, postId, setComments, setTotalPages);
    };
    const handleEdit = () => {
      setEditTargetId(comment.id);
    };

    const isEditing = editTargetId === comment.id;

    const handleEditSave = async () => {
      if (textRef.current != undefined) {
        console.log(textRef.current.value);
        await EditComment(textRef?.current?.value, comment.id);
        setEditTargetId(null);
        await GetCommentList(1, postId, setComments, setTotalPages);
      }
    };

    const handleReply = () => {
      if (!isLogin) {
        dispatch(openLoginForm()); // 로그인되지 않았다면 로그인 폼 열기
      } else {
        setReplying({
          isReplying: !replying.isReplying,
          parent_id: comment.id,
        });
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
                padding-right: 4px;
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
              {comment.user_name === userName && (
                <OptionBar
                  deleteClick={handleDeleteComment}
                  editClick={handleEdit}
                />
              )}
            </div>
            {/* <div>{comment.comment}</div> */}
            {isEditing ? (
              <div>
                <TextField
                  inputRef={textRef}
                  defaultValue={comment.comment}
                  fullWidth
                  multiline
                  css={css`
                    margin-top: 0.5rem;
                  `}
                />
                <div
                  css={css`
                    margin-top: 0.5rem;
                  `}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditTargetId(null)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    css={css`
                      margin-left: 0.5rem;
                    `}
                    onClick={handleEditSave}
                  >
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  css={css`
                    white-space: pre-line;
                  `}
                >
                  {comment.comment}
                </div>
                <div
                  css={css`
                    margin-top: 1rem;
                  `}
                >
                  <button
                    css={css`
                      border: 1px solid #d9d9d9;
                      font-size: 12px;
                      color: #2f2f2f;
                      background-color: #ffffff;
                    `}
                    onClick={handleReply}
                  >
                    답글
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <Divider />
        {replying.isReplying && (
          <CommentReply
            setReplying={setReplying}
            setComments={setComments}
            setPage={setPage}
            setTotalPages={setTotalPages}
            parentId={replying.parent_id}
          />
        )}

        {/* 답글이 있으면 재귀적으로 렌더링 */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply: any, index: number) => (
              <CommentReplyLayout
                setPage={setPage}
                key={reply.comment_id ?? `reply-${index}`}
                comment={reply}
                comments={comments}
                setComments={setComments}
                setTotalPages={setTotalPages}
                editTargetId={editTargetId}
                setEditTargetId={setEditTargetId}
              />
            ))}
          </div>
        )}
      </>
    );
  }
);
