/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
// MUI 제거, emotion css와 HTML로 대체
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useFetchCategories from "../../api/FetchCategories";
import CommunityAction from "./CommunityAction";
type PostType = {
  post_id: number;
  title: string;
  content: string;
  viewCount: number;
  commentcount: number;
  likecount: number;
};

type CommunityContextType = {
  postData: PostType[];
  setPostData: React.Dispatch<React.SetStateAction<PostType[]>>;
};

export const CommunityLayout = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("자유게시판");
  const { categories } = useFetchCategories();
  const [postList, setPostList] = useState<CommunityContextType[]>([]);

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
    <div
      css={css`
        display: flex;
        padding-top: 3rem;

      `}
    >
      <nav
        css={css`
          width: 200px;
          min-height: 80vh;
          border-right: 1px solid #ddd;
        `}
      >
        <ul css={css`list-style: none; margin: 0; padding: 0;`}>
          {categories.map((cat, index) => (
            <li key={index}>
              <button
                css={css`
                  width: 100%;
                  padding: 0rem 0rem 2rem 3rem;
                  text-align: left;
                  border: none;
                  background: none;
                  font-weight: bold;
                  color: ${category === cat.category ? "#2264d6f5" : "#6d6d6dff"};
                  font-size: 1rem;
                  cursor: pointer;
                  transition: background 0.2s;
                  &:hover {
                    color: #8d8d8df5;
                  }
                `}
                onClick={() => handleCategory(cat.category)}
              >
                {cat.category}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 오른쪽 컨텐츠 영역 */}
      <div
        css={css`
          padding: 0 3rem;
          max-width: 1000px;
          margin-right: auto;
          box-sizing: border-box;
          width: 100%;
        `}
      >
        <CommunityAction category={category} setPostList={setPostList} />
        {/* 게시물 영역 */}
        <div
        >
          <Outlet context={{ setPostList, postList }} />
        </div>
      </div>
      <div css={css`width: 100%;        
      max-width: 200px;
      box-sizing: border-box;
`}></div>
    </div>
  );
};
