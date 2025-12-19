import { css } from "@emotion/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoint";
import { request } from "../../api/queries/baseQuery";
import { getCategoryData } from "../../api/getCategoryData";
import { searchPost } from "../../api/SearchPost";
import { postKeys } from "../../api/queryKeys";

const listStyles = css`
  background-color: #fff;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const listItemStyles = css`
  padding: 10px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f6f6f6;
  }
`;

const listItemTextStyles = css`
  flex: 1;
  margin: 0;
`;

const primaryTextStyles = css`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #000;
  line-height: 1.5;
`;

const secondaryTextStyles = css`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.43;
`;

const dividerStyles = css`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  height: 1px;
`;

const iconContainerStyles = css`
  position: absolute;
  bottom: 4px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: gray;
`;

const iconTextStyles = css`
  font-size: 13px;
  margin: 0;
`;

const paginationContainerStyles = css`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
`;

const buttonStyles = css`
  padding: 6px 16px;
  font-size: 14px;
  background-color: #f7f7f8;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const pageButtonStyles = css`
  padding: 3px 6px;
  font-size: 12px;
  background-color: #f7f7f8;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #cacaca;
  }
`;

type postType = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentcount?: number;
  likecount?: number;
};

export const CommunityListPage = () => {
  const categoryMap = {
    question: "질문게시판",
    notice: "공지사항",
    general: "자유게시판",
  } as const;
  type CategoryKey = keyof typeof categoryMap;

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const { search } = useOutletContext<{
    search: { keyword: string; type: string };
  }>();

  const { categoryKey } = useParams<{ categoryKey: CategoryKey }>();
  const category = categoryKey ? categoryMap[categoryKey] : "자유게시판";

  const {
    data: postList,
    isError,
    isLoading,
  } = useQuery({
    queryKey: postKeys.categorySearch(
      category,
      { keyword: search.keyword, type: search.type },
      currentPage
    ),
    queryFn: () => {
      if (search.keyword !== "") {
        return searchPost({ search, category });
      } else {
        return getCategoryData(category, currentPage);
      }
    },
    refetchOnWindowFocus: true, // 창 포커스 시 재조회
    staleTime: 0,
    enabled: !!category,
  });

  const viewCountMutation = useMutation({
    mutationFn: (postId: number) =>
      request({ url: ENDPOINTS.viewCount(postId), method: "PATCH" }),
    onError: (error) => {
      console.error("조회수 증가 실패:", error);
    },
  });

  if (isLoading) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  if (!postList || postList.data.length === 0) {
    return <div>게시글이 없습니다.</div>;
  }

  const removeTag = (html: string) => {
    let text = html.replace(/<img[^>]*>/g, "(이미지)");
    text = text.replace(/<[^>]+>/g, "");
    return text;
  };

  const handleListClick = async (post: postType) => {
    viewCountMutation.mutate(post.id);

    const updatedPost = {
      ...post,
      viewCount: post.viewCount + 1,
    };
    navigate(`/community/post/${post.id}`, { state: updatedPost });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= postList?.meta?.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <ul css={listStyles}>
        {postList?.data.map((post: postType, index: number) => (
          <div key={`${post.id} - ${index}`}>
            <li css={listItemStyles} onClick={() => handleListClick(post)}>
              <div css={listItemTextStyles}>
                <h3 css={primaryTextStyles}>{post.title}</h3>
                <p css={secondaryTextStyles}>{removeTag(post.content) || ""}</p>
              </div>
              <div css={iconContainerStyles}>
                <VisibilityOutlinedIcon sx={{ fontSize: "13px" }} />
                <span css={iconTextStyles}>{post.viewCount ?? 0}</span>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "13px" }} />
                <span css={iconTextStyles}>{post.commentcount}</span>
                <FavoriteBorderIcon sx={{ fontSize: "13px" }} />
                <span css={iconTextStyles}>{post.likecount}</span>
              </div>
            </li>
            <hr css={dividerStyles} />
          </div>
        ))}
      </ul>
      <div css={paginationContainerStyles}>
        {currentPage > 5 && (
          <button
            css={buttonStyles}
            onClick={() => handlePageChange(currentPage - 5)}
          >
            이전
          </button>
        )}

        {Array.from(
          {
            length: postList?.meta.totalPages ?? 1,
          },
          (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                css={[
                  pageButtonStyles,
                  css`
                    color: ${pageNumber === currentPage
                      ? "hsl(216, 55%, 39%)"
                      : "black"};
                    background-color: ${pageNumber === currentPage
                      ? "#e3f2fd"
                      : "#f7f7f8"};
                  `,
                ]}
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          }
        )}

        {currentPage + 5 <= postList?.meta.totalPages && (
          <button
            css={buttonStyles}
            onClick={() => handlePageChange(currentPage + 5)}
          >
            다음
          </button>
        )}
      </div>
    </>
  );
};
