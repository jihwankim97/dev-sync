import { css } from "@emotion/react";
import Header from "./Header";
import Footer from "./Footer";
import { StrictMode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setloggedIn } from "../redux/loginSlice";
import { Outlet } from "react-router-dom";
import "devicon/devicon.min.css";

const layoutStyle = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  @media (max-width: 1600px) {
    max-width: 100%;
    margin: 0;
  }
`;

const contentWrapperStyle = css`
  flex-grow: 1;
  margin-top: 80px;
  width: 100%;
  overflow-x: hidden;
`;

const containerStyle = css`
  max-width: 1400px;
  box-sizing: border-box;
  padding: 0 1rem;
`;

const innerContentStyle = css`
  min-height: 800px;
  background-color: #ffffffff;
  box-sizing: border-box;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:3000/auth/status", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "Not authenticated") {
          dispatch(setloggedIn(false));
        } else {
          dispatch(setloggedIn(true));
        }
      });
  }, []);

  return (
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
        css={css`
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          box-sizing: border-box;
          background-color: #f8f8f8f3;
          height:150px;
          margin-top: 15rem;
        `}
      >
        <Footer />
      </footer>
    </div>
  );
}

export default App;
