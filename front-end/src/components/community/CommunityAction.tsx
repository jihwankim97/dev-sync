import SearchIcon from "@mui/icons-material/Search";
import { css } from "@emotion/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { openLoginForm } from "../../redux/loginSlice";
import type { RootState } from "../../redux/store";
import { buttonStyles, dividerStyles } from "../../styles/resumeCommonStyle";
import {
  searchContainer,
  select as selectStyle,
  inputContainer,
  input as inputStyle,
  searchIcon as searchIconStyle,
} from "../../styles/communityStyles";

interface CommunityActionsProps {
  category: string;
  setSearch: Dispatch<
    SetStateAction<{ keyword: string; type: "title" | "content" | "all" }>
  >;
}

// Centralized styles imported from styles/communityStyles

// 글쓰기 버튼 컨테이너 스타일
const writeButtonContainerStyles = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const CommunityAction = ({ category, setSearch }: CommunityActionsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useSelector((state: RootState) => state.theme.mode);
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
      <div css={searchContainer}>
        <select
          value={localType}
          onChange={(e) => {
            const val = e.target.value as "title" | "content" | "all";
            setLocalType(val);
          }}
          css={selectStyle(mode)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </select>

        <div css={inputContainer}>
          {/* 검색 아이콘 */}
          <SearchIcon css={searchIconStyle(mode)} />
          <input
            type="text"
            css={inputStyle(mode)}
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
      {(category === "자유게시판" ||
        category === "질문게시판" ||
        category === "공지사항") && (
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
