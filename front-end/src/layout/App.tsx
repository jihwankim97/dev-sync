import { css } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTheme } from "../styles/theme";
import { useQuery } from "@tanstack/react-query";
import { setloggedIn } from "../redux/loginSlice";
import { Outlet } from "react-router-dom";
import "devicon/devicon.min.css";
import { loginStateOption } from "../api/queries/userQueries";

const layoutStyle = (theme: any) => css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  margin: 0;
  max-width: none;
  position: relative;
  overflow: hidden;
  // background: ${theme.palette.background.default};
`;

const contentWrapperStyle = (theme: any) => css`
  flex-grow: 1;
  margin-top: ${theme.app?.headerHeight ?? 70}px;
  width: 100%;
  height: 100%;
`;

const containerStyle = css`
  box-sizing: border-box;
  padding: 0 1rem;
  margin: 0;
  width: 100%;
`;

const innerContentStyle = (theme: any) => css`
  min-height: 800px;
  background-color: ${theme.palette.mode === "dark"
    ? "transparent"
    : theme.palette.background.paper};
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state: any) => state.theme.mode);
  const { data } = useQuery(loginStateOption());

  useEffect(() => {
    if (data) {
      dispatch(setloggedIn(true));
    } else {
      dispatch(setloggedIn(false));
    }
  }, [data, dispatch]);

  const theme = getTheme(mode ?? "light");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div css={layoutStyle}>
        <div css={containerStyle}>
          <Header />
        </div>

        <main css={contentWrapperStyle}>
          <div css={innerContentStyle}>
            <Outlet />
          </div>
        </main>

        <footer
          css={(theme: any) => css`
            width: 100%;
            box-sizing: border-box;
            background: ${theme.palette.mode === "dark"
              ? "rgba(15, 17, 20, 0.8)"
              : "#f8f8f8f3"};
            backdrop-filter: ${theme.palette.mode === "dark"
              ? "blur(10px)"
              : "none"};
            border-top: ${theme.palette.mode === "dark"
              ? "1px solid rgba(240, 246, 252, 0.1)"
              : "1px solid rgba(0,0,0,0.06)"};
            height: 180px;
            position: relative;
            z-index: 1;
          `}
        >
          <Footer />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
