import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, css, Divider, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DeletePostDialog } from "../../components/community/DeletePostDialog";
import { OptionBar } from "../../components/community/OptionBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../../api/queryKeys";
import { request } from "../../api/queries/baseQuery";
import { ENDPOINTS } from "../../api/endpoint";
import { userDataOption } from "../../api/queries/userQueries";
import { CommentPost } from "../../components/community/CommentPost";

export const ReadPostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const post = location.state; // `navigate`에서 전달된 데이터
  const [date, time] = post.createdAt.split("T");
  const formmatTime = time.substring(0, 5);
  //xss 방지를 위한 데이터 처리
  const sanitizedContent = DOMPurify.sanitize(post.content);
  const queryClient = useQueryClient();
  const { data: userData } = useQuery(userDataOption());

  //좋아요 상태 조회
  const { data: likeStatus } = useQuery({
    queryKey: postKeys.likeStatus(post.id),
    queryFn: () =>
      request({
        url: `${ENDPOINTS.postLike(post.id)}/status`,
        responseType: "text",
      }),
    enabled: !!post.id,
  });

  //좋아요 갯수 조회
  const { data: likeCount } = useQuery({
    queryKey: postKeys.likeCount(post.id),
    queryFn: () =>
      request({
        url: `${ENDPOINTS.postLike(post.id)}/count`,
      }),
    enabled: !!post.id,
  });

  //좋아요 토글 변경
  const likeToggle = useMutation({
    mutationFn: () =>
      request({
        url: `${ENDPOINTS.base()}/post/${post.id}/like-toggle`,
        method: "POST",
      }),
    onSuccess: () => {
      console.log("좋아요 토글 성공");
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({
        queryKey: postKeys.likeStatus(post.id),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.likeCount(post.id),
      });
    },
    onError: (error) => {
      console.error("좋아요 토글 실패:", error);
    },
  });

  const handleButton = async () => {
    if (post.id && !likeToggle.isPending) {
      try {
        const result = await likeToggle.mutateAsync();
        console.log("토글 결과:", result);
      } catch (error) {
        console.error("좋아요 토글 중 에러:", error);
      }
    }
  };
  const handleDelete = () => {
    setOpen(true);
  };

  const handleEditPost = () => {
    const updatedPost = {
      ...post,
      edit: true,
      from: post.category.category,
    };
    navigate(`/post/${post.id}/edit`, { state: updatedPost });
  };

  return (
    <>
      <div
        css={css`
          width: 100%;
        `}
      >
        <div
          css={css`
            background-color: #fdfdfd;
            padding: 1.7rem 1.5rem;
            border-radius: 10px;
          `}
        >
          <div
            css={css`
              margin-bottom: 2rem;
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
                  height: 10%;
                  font-size: 1.7rem;
                  font-weight: bold;
                `}
              >
                {post.title}
              </div>
              <div>
                {post?.user?.id === userData?.id && (
                  <OptionBar
                    deleteClick={handleDelete}
                    editClick={handleEditPost}
                  />
                )}
              </div>
            </div>
            <div
              css={css`
                display: flex;
                color: #898989;
                font-size: 14px;
              `}
            >
              <div>
                {date} {formmatTime}
              </div>
              <div
                css={css`
                  margin: 0px 8px;
                `}
              >
                {post.user.name}
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <VisibilityOutlinedIcon
                  sx={{ fontSize: "13px", marginRight: "3px" }}
                />
                <Typography sx={{ fontSize: "13px" }}>
                  {post.viewCount ?? 0}
                </Typography>
              </div>
            </div>
          </div>
          <div
            css={css`
              padding-bottom: 60px;
              min-height: fit-content;
              img {
                max-width: 30%;
                height: auto;
                display: block;
                margin: 0 auto;
              }
            `}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
        <div>
          <Divider />
        </div>
        <div
          css={css`
            width: 85px;
            position: fixed;
            top: 25%;
            right: max(6%, 20px);
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          `}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{
              width: "100%",
              margin: "2px",
              padding: "5 0rem",
              color: "#588eda",
              boxShadow: "0px 0px 5px rgba(230, 230, 230, 0.8)",
            }}
          >
            <KeyboardBackspaceIcon />
          </Button>
          <Button
            disabled={likeToggle.isPending}
            onClick={handleButton}
            variant="outlined"
            sx={{
              width: "100%",
              margin: "2px",
              padding: "5 0rem",
              color: "#588eda",
              gap: "5px",
              boxShadow: "0px 0px 5px rgba(230, 230, 230, 0.8)",
            }}
          >
            {likeStatus === "true" ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <span>{likeCount || 0}</span>
          </Button>
        </div>
        <CommentPost />
        {/* </div> */}
      </div>
      <DeletePostDialog open={open} setOpen={setOpen} postId={post.id} />
    </>
  );
};
