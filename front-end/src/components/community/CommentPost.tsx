/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { Avatar, Button, Divider, TextField } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { EditComment } from "../../api/EditComment";
import { GetCommentList } from "../../api/GetCommentList";
import { RemoveComment } from "../../api/RemoveComment";
import { SendComment } from "../../api/SendComment";
import { useEvent } from "../../hooks/useEvent";
import { openLoginForm } from "../../redux/loginSlice";
import { CommentGroup } from "./CommentGroup";
import { CommentReply } from "./CommentReply";
import { OptionBar } from "./OptionBar";
import type { RootState } from "../../redux/store";
import { fetchUserInfo } from "../../api/UserApi";
import type { userInfo } from "../../types/resume.type";

const CommentLayout = memo(
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
    const userId = userData?.id;
    const location = useLocation();
    const postId = location.state.post_id; // `navigate`에서 전달된 데이터
    const textRef = useRef<HTMLInputElement | null>(null);
    const isLogin = useSelector((state: RootState) => state.login.loggedIn);
    const dispatch = useDispatch();
    const [replying, setReplying] = useState({
      isReplying: false,
      parent_id: 0,
    });

    useEffect(() => {
      fetchUserInfo()
        .then((data) => {
          setUserData(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message || "알 수 없는 에러");
        });
    }, []);

    const handleDeleteComment = async () => {
      await RemoveComment(comment.comment_id);

      GetCommentList(1, postId, setComments, setTotalPages);
    };
    const handleEdit = () => {
      setEditTargetId(comment.comment_id);
    };

    const isEditing = editTargetId === comment.comment_id;

    const handleEditSave = async () => {
      if (textRef.current != undefined) {
        console.log(textRef.current.value);
        await EditComment(textRef?.current?.value, comment.comment_id);
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
          parent_id: comment.comment_id,
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
                padding-right:;
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
              {comment.user_id === userId && (
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
            {comment.replies.map((reply: any) => (
              <CommentLayout
                setPage={setPage}
                key={reply.comment_id}
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

export const CommentPost = () => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<userInfo>();

  const location = useLocation();
  const postId = location.state.post_id; // `navigate`에서 전달된 데이터
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.login.loggedIn);
  let userId = 0;
  useEffect(() => {
    fetchUserInfo()
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.log(err.message || "알 수 없는 에러");
      });
  }, []);

  if (userData) {
    userId = userData.id;
  }

  useEffect(() => {
    GetCommentList(page, postId, setComments, setTotalPages);
  }, [page]);

  //댓글 입력시 이벤트 처리
  const eventComment = useEvent(async (value: any) => {
    console.log(value, userId, postId);
    await SendComment(value, null, userId, postId);
    //댓글 추가후 첫페이지로 이동 및 댓글 가져오기
    await GetCommentList(1, postId, setComments, setTotalPages);
    setPage(1);
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
          onClick={() => {
            handleAddComment();
          }}
        >
          입력
        </Button>
      </div>
      {/* 댓글 그룹화된 데이터 출력 */}
      {groupComments.map((rootComment) => (
        <CommentLayout
          key={rootComment.comment_id}
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
