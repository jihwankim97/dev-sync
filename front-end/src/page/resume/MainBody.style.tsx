import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const MainContainer = styled.div(
  ({ theme }) => css`
    font-family: "Inter", sans-serif;
    background: ${theme.palette.mode === "dark" ? "transparent" : "#f8fafc"};
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};
  `
);

export const HeroSection = styled.section(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(1rem, 3vw, 3rem);
    background: ${theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0d1117 0%, #1a1f2e 30%, #2d1b3d 60%, #1a1f2e 100%)"
      : "linear-gradient(to right, #105ecb 20%, #61c0ff 65%, #fffafa 100%)"};
    color: #ffffff;
    height: 100%;
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    overflow: ${theme.palette.mode === "dark" ? "hidden" : "visible"};

    ${theme.palette.mode === "dark"
      ? `&::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.8), transparent),
      radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.7), transparent),
      radial-gradient(2px 2px at 90% 40%, rgba(255,255,255,0.5), transparent);
    background-size: 200% 200%;
    background-position: 0% 0%;
    animation: starMove 60s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes starMove {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }`
      : ""}
  `
);

export const HeroContent = styled.div(
  ({ theme }) => css`
    flex: 0 1 auto;
    width: clamp(360px, 42vw, 900px);
    height: 100%;
    padding: clamp(16px, 2.5vw, 64px);
    margin: 0 10%;
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};

    h1 {
      font-size: clamp(1.6rem, 3vw, 3rem);
      font-weight: 800;
      margin-bottom: 3rem;
      line-height: 1.3;
      color: ${theme.palette.mode === "dark" ? "#ffffff" : "inherit"};
    }

    p {
      font-size: 1.3rem;
      color: ${theme.palette.mode === "dark" ? "#c9d1d9" : "#e0f2fe"};
    }

    span {
      background: ${theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)"
        : "linear-gradient(to right, #7d7fff, #6cfff3)"};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
  `
);

export const ImgMain = styled.div(
  ({ theme }) => css`
    flex: 0 1 auto;
    width: clamp(280px, 38vw, 760px);
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};
    margin: 0 auto;

    img {
      display: block;
      margin: 0 auto;
      width: 85%;
      max-width: 100%;
      height: auto;
    }
  `
);

const SectionBase = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: var(--section-height, 560px);
  box-sizing: border-box;
`;

export const TargetUsersSection = styled(SectionBase)(
  ({ theme }) => css`
    padding: 30px 0 30px 0;
    background: ${theme.palette.mode === "dark" ? "transparent" : "#f8fbff"};
    --section-height: 560px;
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};
  `
);

export const SectionTitle = styled.h2(
  ({ theme }) => css`
    text-align: center;
    font-weight: 700;
    font-size: clamp(2rem, 3vw, 4rem);
    margin-bottom: 40px;
    color: ${theme.palette.mode === "dark" ? "#ffffff" : "inherit"};
  `
);

export const Cards = styled.div`
  display: flex;
  justify-content: center;
  gap: 36px;
  padding: 5rem;
  flex-wrap: wrap;
`;

export const UserCard = styled.div(
  ({ theme }) => css`
    background: ${theme.palette.mode === "dark"
      ? "rgba(22, 27, 34, 0.8)"
      : "#fff"};
    ${theme.palette.mode === "dark" ? "backdrop-filter: blur(10px);" : ""}
    border: ${theme.palette.mode === "dark"
      ? "1px solid rgba(240, 246, 252, 0.1)"
      : "none"};
    border-radius: 24px;
    box-shadow: ${theme.palette.mode === "dark"
      ? "0 4px 16px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.15)"
      : "0 2px 16px 0 rgba(79, 141, 255, 0.133)"};
    padding: 32px;
    min-width: 260px;
    max-width: 320px;
    transition: all 0.3s ease;
    text-align: left;
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};

    ${theme.palette.mode === "dark"
      ? `&:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 50px rgba(124,58,237,0.2);
    border-color: rgba(88, 166, 255, 0.3);
  }`
      : ""}

    img {
      border-radius: 16px;
      margin-bottom: 18px;
      max-width: 100%;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    h3 {
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 8px;
      color: ${theme.palette.mode === "dark" ? "#58a6ff" : "#4f8cff"};
    }

    p {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 6px;
      color: ${theme.palette.mode === "dark" ? "#c9d1d9" : "inherit"};
    }

    span {
      color: ${theme.palette.mode === "dark" ? "#8b949e" : "#888"};
      font-size: 15px;
    }
  `
);

export const InfoSection = styled(SectionBase)(
  ({ theme }) => css`
    padding: 5rem 0;
    background: ${theme.palette.mode === "dark" ? "transparent" : "#fff"};
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};
  `
);

export const InfoBox = styled.div`
  max-width: 800px;
  margin: 0 1rem;
  text-align: center;
`;

export const StepList = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

export const StepItem = styled.div(
  ({ theme }) => css`
    text-align: center;
    max-width: 220px;

    .number {
      font-size: 40px;
      font-weight: 700;
      color: ${theme.palette.mode === "dark" ? "#58a6ff" : "#4f8cff"};
      margin-bottom: 8px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 6px;
      color: ${theme.palette.mode === "dark" ? "#ffffff" : "inherit"};
    }

    .desc {
      color: ${theme.palette.mode === "dark" ? "#8b949e" : "#888"};
      font-size: 15px;
    }
  `
);

export const CommunitySection = styled(SectionBase)(
  ({ theme }) => css`
    background: ${theme.palette.mode === "dark" ? "transparent" : "#f4f8ff"};
    padding: 100px 1rem 130px 1rem;
    box-shadow: ${theme.palette.mode === "dark"
      ? "none"
      : "0 2px 24px 0 rgba(79, 140, 255, 0.1)"};
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};
  `
);

export const CommunityDesc = styled.div(
  ({ theme }) => css`
    font-size: 25px;
    color: ${theme.palette.mode === "dark" ? "#ffffff" : "#222"};
    font-weight: 600;
    margin-bottom: 20px;
  `
);

export const CommunityDetail = styled.div(
  ({ theme }) => css`
    color: ${theme.palette.mode === "dark" ? "#8b949e" : "#666"};
    font-size: 18px;
    margin-bottom: 18px;
  `
);

export const Features = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 60px;
  flex-wrap: wrap;
`;

export const Feature = styled.div(
  ({ theme }) => css`
    background: ${theme.palette.mode === "dark"
      ? "rgba(22, 27, 34, 0.8)"
      : "#fff"};
    ${theme.palette.mode === "dark" ? "backdrop-filter: blur(10px);" : ""}
    border: ${theme.palette.mode === "dark"
      ? "1px solid rgba(240, 246, 252, 0.1)"
      : "none"};
    border-radius: 16px;
    box-shadow: ${theme.palette.mode === "dark"
      ? "0 4px 16px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.15)"
      : "0 2px 8px 0 rgba(79, 140, 255, 0.08)"};
    padding: 18px 32px;
    font-weight: 600;
    color: ${theme.palette.mode === "dark" ? "#58a6ff" : "#3578e5"};
    font-size: 17px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    ${theme.palette.mode === "dark"
      ? `&:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 50px rgba(124,58,237,0.2);
    border-color: rgba(88, 166, 255, 0.3);
  }`
      : ""}
  `
);

export const CTASection = styled(SectionBase)(
  ({ theme }) => css`
    background: ${theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)"
      : "linear-gradient(90deg, #4f8cff 0%, #6ad1ff 100%)"};
    padding: 100px 1rem;
    text-align: center;
    box-shadow: ${theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0,0,0,0.5), 0 0 50px rgba(124,58,237,0.3)"
      : "0 4px 32px 0 rgba(79, 140, 255, 0.13)"};
    position: ${theme.palette.mode === "dark" ? "relative" : "initial"};
    z-index: ${theme.palette.mode === "dark" ? 1 : "auto"};

    h2 {
      color: #fff;
      font-weight: 800;
      font-size: 2.5rem;
      margin-bottom: 18px;
      letter-spacing: -1px;
    }

    p {
      color: ${theme.palette.mode === "dark" ? "#e0f2fe" : "#eaf3ff"};
      font-size: 18px;
      margin-bottom: 60px;
      font-weight: 500;
    }
  `
);

export const StartButton = styled.button(
  ({ theme }) => css`
    color: #fff;
    background-color: ${theme.palette.mode === "dark" ? "#238636" : "#153d93"};
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    ${theme.palette.mode === "dark"
      ? "box-shadow: 0 4px 12px rgba(35, 134, 54, 0.3);"
      : ""}

    &:hover {
      ${theme.palette.mode === "dark"
        ? "background-color: #2ea043; box-shadow: 0 6px 20px rgba(35,134,54,0.4); transform: translateY(-2px);"
        : "background-color: #e0f2fe;"}
    }
  `
);

export const Responsive = styled.div(
  ({ theme }) => css`
    @media (max-width: 768px) {
      html,
      body {
        height: 100%;
        margin: 0;
      }

      .main-container & {
        height: 100svh;
      }

      ${HeroSection} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        min-height: 90svh;
        height: auto;
        flex-grow: 1;
        text-align: center;
        background: ${theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #0d1117 0%, #1a1f2e 30%, #2d1b3d 60%, #1a1f2e 100%)"
          : "linear-gradient(to bottom, #105ecb 20%, #61c0ff 60%, #fff7f7 100%)"};
        box-sizing: border-box;
      }

      ${HeroContent} {
        padding: 1.5rem;
        min-height: 280px;
        height: auto;
      }

      ${StartButton} {
        margin-top: 3rem;
      }

      ${HeroContent} h1 {
        font-size: 2rem;
        padding-top: 3rem;
      }

      ${HeroContent} p {
        font-size: 1.1rem;
      }

      ${ImgMain} {
        margin: 0 auto;
        width: 80%;
      }
    }
  `
);
