/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import LoginForm from "../components/user/LoginForm";
import ProfileButton from "../components/user/ProfileButton";
import { openLoginForm } from "../redux/loginSlice";
import { toggleTheme } from "../redux/themeSlice";
const containerStyle = css`
  max-width: 1600px; /* main과 동일하게 설정 */
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  box-sizing: border-box;
`;
const Header = () => {
  // 다크/라이트 토글 상태 redux로 관리

  const dispatch = useDispatch();
  const mode = useSelector((state: any) => state.theme.mode);
  const handleThemeToggle = () => dispatch(toggleTheme());
  const isLogin = useSelector((state: any) => state.login.loggedIn);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogin = () => {
    dispatch(openLoginForm());
  };

  const handleNavigate = (path: string) => {
    if (!isLogin) {
      dispatch(openLoginForm());
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header
        css={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100vw;
          z-index: 1000;
          background: ${mode === "dark"
            ? "rgba(2, 2, 2, 0.36)"
            : "rgba(255, 255, 255, 0.8)"};
          backdrop-filter: blur(5px);
          border-bottom: ${mode === "dark"
            ? "1px solid rgba(34, 33, 33, 1)"
            : "1px solid #d2d1d1"};
          height: 70px;
        `}
      >
        <div
          css={css`
            max-width: 1600px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            box-sizing: border-box;
            padding: 0 1rem;
          `}
        >
          {/* 모바일용 햄버거 메뉴 (왼쪽) */}
          <div
            css={css`
              display: none;
              @media (max-width: 900px) {
                display: flex;
                z-index: 2;
              }
            `}
          >
            <button
              css={css`
                background: none;
                border: none;
                padding: 0.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
              `}
              onClick={handleMenuClick}
            >
              <MenuIcon
                sx={{ color: mode === "dark" ? "#ffffff" : "#3369c7" }}
              />
            </button>
          </div>

          {/* 로고 */}
          <div
            css={css`
              position: static;
              left: auto;
              transform: none;
              z-index: 1;
              // margin: 0 1rem;
              @media (max-width: 900px) {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
              }
            `}
          >
            <img
              src={logo}
              alt="로고"
              css={css`
                height: 45px;
                cursor: pointer;
                transition: filter 0.2s;
                &:hover {
                  filter: brightness(0.85);
                }
              `}
              onClick={() => navigate("/")}
            />
          </div>

          {/* PC 메뉴 (중앙) */}
          <nav
            css={css`
              display: flex;
              flex-grow: 1;
              margin-left: 2rem;
              @media (max-width: 900px) {
                display: none;
              }
            `}
          >
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#e0e0e0ff" : "#3369c7"};
                margin-right: 1.5rem;
                cursor: pointer;
              `}
              onClick={() => handleNavigate("/resume")}
            >
              이력서
            </button>
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#e0e0e0ff" : "#3369c7"};
                margin-right: 1.5rem;
                cursor: pointer;
              `}
              onClick={() => navigate("/inquiry")}
            >
              문의
            </button>
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#e0e0e0ff" : "#3369c7"};
                margin-right: 1.5rem;
                cursor: pointer;
              `}
              onClick={() => navigate("/community/general")}
            >
              커뮤니티
            </button>
          </nav>

          {/* 로그인/프로필 + 테마 토글 (오른쪽) */}
          <div
            css={css`
              margin-left: auto;
              display: flex;
              align-items: center;
              margin-right: 1rem;
              gap: 0.5rem;
            `}
          >
            {/* 테마 토글 버튼 */}
            <button
              onClick={handleThemeToggle}
              css={css`
                width: 35px;
                height: 35px;
                border-radius: 50%;
                border: 1.5px solid #e0e0e0;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 0.5rem;
                font-size: 0.9rem;
                transition:
                  box-shadow 0.15s,
                  border-color 0.15s;
                &:hover {
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
                }
              `}
              aria-label="테마 토글"
            >
              {mode === "dark" ? (
                <DarkModeIcon sx={{ color: "#cfcfcfff" }} />
              ) : (
                <LightModeIcon sx={{ color: "#fbc02d" }} />
              )}
            </button>
            {/* 로그인/프로필 */}
            {!isLogin ? (
              <button
                css={css`
                  background: ${mode === "dark" ? "none" : "#3369c7"};
                  color: ${mode === "dark" ? "#cfcfcfff" : "#ffffffff"};
                  border: ${mode === "dark" ? "1px solid #ffffffff" : "none"};
                  border-radius: 7px;
                  padding: 0.4rem 1rem;
                  font-size: 0.9rem;
                  cursor: pointer;
                  font-weight: bold;

                  transition: background 0.2s;
                  &:hover {
                    background: ${mode === "dark" ? "none" : "#254e8e"};
                  }
                `}
                onClick={handleOpenLogin}
              >
                로그인
              </button>
            ) : (
              <ProfileButton />
            )}
          </div>
        </div>

        {/* 모바일용 메뉴 드롭다운 */}
        {anchorEl && (
          <div
            css={css`
              position: absolute;
              top: 70px;
              left: 0;
              width: 100vw;
              background: ${mode === "dark" ? "rgba(13,17,23,0.95)" : "#fff"};
              box-shadow: ${mode === "dark"
                ? "0 2px 12px rgba(0, 0, 0, 0.3)"
                : "0 2px 12px rgba(0, 0, 0, 0.08)"};
              z-index: 2000;
              display: flex;
              flex-direction: column;
            `}
          >
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#ffffff" : "#3369c7"};
                font-size: 1.1rem;
                padding: 1rem;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid
                  ${mode === "dark" ? "rgba(240, 246, 252, 0.1)" : "#eee"};
              `}
              onClick={() => {
                handleNavigate("/resume");
                handleMenuClose();
              }}
            >
              이력서
            </button>
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#ffffff" : "#3369c7"};
                font-size: 1.1rem;
                padding: 1rem;
                text-align: left;
                cursor: pointer;
                border-bottom: 1px solid
                  ${mode === "dark" ? "rgba(240, 246, 252, 0.1)" : "#eee"};
              `}
              onClick={() => {
                navigate("/inquiry");
                handleMenuClose();
              }}
            >
              문의
            </button>
            <button
              css={css`
                background: none;
                border: none;
                color: ${mode === "dark" ? "#ffffff" : "#3369c7"};
                font-size: 1.1rem;
                padding: 1rem;
                text-align: left;
                cursor: pointer;
              `}
              onClick={() => {
                navigate("/community/general");
                handleMenuClose();
              }}
            >
              커뮤니티
            </button>
          </div>
        )}
      </header>
      {/* 로그인 모달 */}
      <LoginForm />
    </>
  );
};

export default Header;
