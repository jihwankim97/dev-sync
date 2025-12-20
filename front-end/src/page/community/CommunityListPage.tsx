import { css } from "@emotion/react";
import { useSelector } from "react-redux";
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

import {
  list,
  listItem,
  listItemText,
  primaryText,
  secondaryText,
  dividerLine,
  iconContainer,
  iconText,
  paginationContainer,
  pagerButton,
  pageButton,
} from "../../styles/communityStyles";

type postType = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentcount?: number;
  likecount?: number;
};

export const CommunityListPage = () => {
  const mode = useSelector((state: any) => state.theme.mode);
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
      <ul css={list(mode)}>
        {postList?.data.map((post: postType, index: number) => (
          <div key={`${post.id} - ${index}`}>
            <li css={listItem(mode)} onClick={() => handleListClick(post)}>
              <div css={listItemText}>
                <h3 css={primaryText(mode)}>{post.title}</h3>
                <p css={secondaryText(mode)}>{removeTag(post.content) || ""}</p>
              </div>
              <div css={iconContainer(mode)}>
                <VisibilityOutlinedIcon sx={{ fontSize: "13px" }} />
                <span css={iconText(mode)}>{post.viewCount ?? 0}</span>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "13px" }} />
                <span css={iconText(mode)}>{post.commentcount}</span>
                <FavoriteBorderIcon sx={{ fontSize: "13px" }} />
                <span css={iconText(mode)}>{post.likecount}</span>
              </div>
            </li>
            <hr css={dividerLine(mode)} />
          </div>
        ))}
      </ul>
      <div css={paginationContainer}>
        {currentPage > 5 && (
          <button
            css={pagerButton(mode)}
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
                css={pageButton(mode, pageNumber === currentPage)}
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
            css={pagerButton(mode)}
            onClick={() => handlePageChange(currentPage + 5)}
          >
            다음
          </button>
        )}
      </div>
    </>
  );
};
