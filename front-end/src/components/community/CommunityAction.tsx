import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { openLoginForm } from "../../redux/loginSlice";
import type { RootState } from "../../redux/store";

interface CommunityActionsProps {
  category: string;
  setPostList: any;
}

const CommunityAction = ({ category, setPostList }: CommunityActionsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<"title" | "content" | "all">(
    "all"
  );
  const isLogin = useSelector((state: RootState) => state.login.loggedIn);
  const dispatch = useDispatch();

  // 게시물 페이지에서는 안 보이게 설정
  const isPostPage = location.pathname.startsWith("/community/post/");

  if (isPostPage) return null;

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    const response = await fetch(
      `http://localhost:3000/post/search?keyword=${encodeURIComponent(
        keyword
      )}&category=${encodeURIComponent(category)}&type=${searchType}`
    );

    if (!response.ok) {
      console.error("검색 실패");
      return;
    }

    const result = await response.json();
    // console.log(result);
    setPostList(result);
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
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Select
          value={searchType}
          size="small"
          onChange={(e) => setSearchType(e.target.value as any)}
          sx={{ marginRight: "1rem", width: "140px", backgroundColor: "white" }}
        >
          <MenuItem value="title">제목</MenuItem>
          <MenuItem value="content">내용</MenuItem>
          <MenuItem value="all">제목+내용</MenuItem>
        </Select>

        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, backgroundColor: "white" }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{ marginLeft: "1rem" }}
          onClick={handleSearch}
        >
          검색
        </Button>
      </div>

      {/* 글쓰기 버튼 */}
      {(category === "자유게시판" || category === "질문게시판") && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button onClick={handleWrite} variant="contained">
            글쓰기
          </Button>
        </div>
      )}

      <Divider />
    </>
  );
};

export default CommunityAction;
