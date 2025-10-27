import SearchIcon from "@mui/icons-material/Search";
import { css } from "@emotion/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { openLoginForm } from "../../redux/loginSlice";
import type { RootState } from "../../redux/store";
import { buttonStyles, dividerStyles } from "../../styles/resumeCommonStyle";

interface CommunityActionsProps {
  category: string;
  setSearch: Dispatch<
    SetStateAction<{ keyword: string; type: "title" | "content" | "all" }>
  >;
}

// 검색바 컨테이너 스타일
const searchContainerStyles = css`
  display: flex;
  margin-bottom: 1rem;
  gap: 1rem;
`;

// Select 스타일
const selectStyles = css`
  width: 140px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

// TextField 스타일
const inputContainerStyles = css`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const inputStyles = css`
  width: 100%;
  padding: 8px 12px 8px 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const searchIconStyles = css`
  position: absolute;
  left: 12px;
  color: #666;
  pointer-events: none;
  z-index: 1;
`;

// 글쓰기 버튼 컨테이너 스타일
const writeButtonContainerStyles = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const CommunityAction = ({ category, setSearch }: CommunityActionsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  // 입력값은 로컬 상태로 관리
  const [localKeyword, setLocalKeyword] = useState("");
  const [localType, setLocalType] = useState<"title" | "content" | "all">(
    "all"
  );
  const isLogin = useSelector((state: RootState) => state.login.loggedIn);
  const dispatch = useDispatch();

  // 게시물 페이지에서는 안 보이게 설정
  const isPostPage = location.pathname.startsWith("/community/post/");
  if (isPostPage) return null;

  // 검색 버튼 클릭 시 상위 상태에 반영
  const handleSearch = () => {
    setSearch({ keyword: localKeyword, type: localType });
  };

  const handleWrite = () => {
    if (!isLogin) {
      dispatch(openLoginForm()); // 로그인되지 않았다면 로그인 폼 열기
    } else {
      navigate("/post/new", { state: { from: category } });
    }
  };

  return (
    <>
      {/* 검색 바 */}
      <div css={searchContainerStyles}>
        <select
          value={localType}
          onChange={(e) => {
            const val = e.target.value as "title" | "content" | "all";
            setLocalType(val);
          }}
          css={selectStyles}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </select>

        <div css={inputContainerStyles}>
          {/* 검색 아이콘 */}
          <SearchIcon css={searchIconStyles} />
          <input
            type="text"
            css={inputStyles}
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="검색어를 입력하세요"
          />
        </div>

        <button css={buttonStyles()} onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 글쓰기 버튼 */}
      {(category === "자유게시판" || category === "질문게시판") && (
        <div css={writeButtonContainerStyles}>
          <button css={buttonStyles()} onClick={handleWrite}>
            글쓰기
          </button>
        </div>
      )}

      <hr css={dividerStyles} />
    </>
  );
};

export default CommunityAction;
