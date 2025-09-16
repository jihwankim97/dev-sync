/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  blueBackgroundStyle,
  containerStyle,
  contentWrapperStyle,
  headerStyle,
  titleStyle,
} from "../styles/resumeCommonStyle";


export interface ResumeContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  repoData: { name: string }[];
  setRepoData: React.Dispatch<React.SetStateAction<{ name: string }[]>>;

  selectedRepos: { name: string; selected: boolean }[];
  setSelectedRepos: React.Dispatch<
    React.SetStateAction<{ name: string; selected: boolean }[]>
  >;
}
const subtitleStyle = css`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  z-index: 1;
`;

export const ResumeSetupLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState<{ name: string }[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<
    { name: string; selected: boolean }[]
  >([]);

  const contextValue: ResumeContextType = {
    repoData,
    setRepoData,
    selectedRepos,
    setSelectedRepos,
    isLoading,
    setIsLoading,
  };

  const location = useLocation();

  const isListPage = location.pathname !== "/resume/list";

  const navigate = useNavigate();

  return (
    <div css={containerStyle}>
      <div css={blueBackgroundStyle} />
      <div css={contentWrapperStyle}>
        <header css={headerStyle}>
          <h2>DevSync</h2>
          <Button
            css={css`
              color: #ffffff;
              margin: 1rem;
            `}
            variant="text"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="medium" />
          </Button>
        </header>
        <>
          {isListPage && (
            <section
              css={css`
                position: relative;
                color: #ffffff;
                margin: 0rem 6rem 4rem 6rem;
                @media (max-width: 768px) {
                  margin: 6rem 1.5rem;
                }
              `}
            >
              <>
                <div css={titleStyle}>
                  <span>🚀Git 연동을 통해</span>
                  <span>&nbsp;포트폴리오를 작성해보세요.</span>
                </div>
                <p css={subtitleStyle}>
                  <span>Git 정보를 가져와 자동으로 이력서를 작성하고</span>
                  <span>PDF로 저장할 수 있어요.</span>
                </p>
              </>
            </section>
          )}
          <main>
            <Outlet context={contextValue} />
          </main>
        </>
      </div>
    </div>
  );
};
