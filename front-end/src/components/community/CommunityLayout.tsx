import { css } from "@emotion/react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchCategories from "../../api/FetchCategories";
import CommunityAction from "./CommunityAction";
import {
  communityContainer,
  sidebarNav,
  categoryButton,
  contentArea,
} from "../../styles/communityStyles";

type PostType = {
  post_id: number;
  title: string;
  content: string;
  viewCount: number;
  commentcount: number;
  likecount: number;
};

export const CommunityLayout = () => {
  const navigate = useNavigate();
  const mode = useSelector((state: any) => state.theme.mode);
  const [category, setCategory] = useState("자유게시판");
  const { categories } = useFetchCategories();
  const [search, setSearch] = useState<{
    keyword: string;
    type: "title" | "content" | "all";
  }>({
    keyword: "",
    type: "all",
  });

  const handleCategory = (category: string) => {
    setCategory(category);
    navigate(
      category === "자유게시판"
        ? "/community/general"
        : category === "질문게시판"
          ? "/community/question"
          : category === "공지사항"
            ? "/community/notice"
            : "/inquiry"
    );
  };

  return (
    <div css={communityContainer(mode)}>
      <nav css={sidebarNav(mode)}>
        <ul
          css={css`
            list-style: none;
            margin: 0;
            padding: 0;
          `}
        >
          {categories.map((cat, index) => (
            <li key={index}>
              <button
                css={categoryButton(mode, category === cat.category)}
                onClick={() => handleCategory(cat.category)}
              >
                {cat.category}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 오른쪽 컨텐츠 영역 */}
      <div css={contentArea}>
        <CommunityAction category={category} setSearch={setSearch} />
        {/* 게시물 영역 */}
        <div>
          <Outlet context={{ search }} />
        </div>
      </div>
      <div
        css={css`
          display: none;
        `}
      ></div>
    </div>
  );
};
