/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const containerStyle = css`
  display: flex;
  position: relative;
  flex-direction: column;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  min-height: 100vh;
  background-color: #ededed;
`;

const titleStyle = css`
  font-size: 3rem;
  margin-top: 6rem;
  span {
    display: block; /* 기본은 inline */
  }
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  font-weight: bold;
  text-align: center;
  z-index: 1;
`;

const contentWrapperStyle = css`
  position: relative;
  z-index: 1; // 파란 배경보다 위
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const blueBackgroundStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; // 전체 높이
  background: #3599fd;
  transform: skewY(-5deg);
  transform-origin: top left;
  z-index: 0;
`;

const headerStyle = css`
  position: relative;
  display: flex;
  z-index: 0;
  padding-left: 1rem;
  width: 100%;
  justify-content: space-between;
  color: #ffffff;
`;

const skillsCloseBtn = css`
  padding: 0px 0px 0px 0px;
  margin-left: 5px;
  color: #4d4d4d;
  display: flex;
  border: none;
  align-items: right;
  &:hover {
    color: #e53935; // 호버 시 빨강
    background: #f5f5f5; // 선택 사항, 버튼 배경 살짝 변경
    border: none;
  }
`;

const whiteButtonStyle = css`
  border: 1px solid #d9d9d9;
  font-size: 12px;
  color: #2f2f2f;
  background-color: #ffffff;
`;

const buttonStyles = (size: "sm" | "md" | "lg" = "md") => {
  const sizeConfig = {
    sm: {
      padding: "6px 12px",
      fontSize: "12px",
      borderRadius: "3px",
    },
    md: {
      padding: "8px 16px",
      fontSize: "14px",
      borderRadius: "5px",
    },
    lg: {
      padding: "9px 18px",
      fontSize: "16px",
      borderRadius: "7px",
    },
  };

  const config = sizeConfig[size];

  return css`
    padding: ${config.padding};
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: ${config.borderRadius};
    font-size: ${config.fontSize};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #1565c0;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background-color: #0d47a1;
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
    }
  `;
};

// Divider 스타일
const dividerStyles = css`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  height: 1px;
  margin: 0;
`;

const textAreaStyles = css`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #b5b5b5;
  box-sizing: border-box;
  font-size: 14px;
  font-family: inherit;
  resize: none; /* autosize handled by JS */
  overflow: hidden;
  background-color: #ffffff;

  &:focus {
    outline: none; /* 포커스 링 제거 */
    border: 1px solid #717171;
  }
`;

export {
  containerStyle,
  headerStyle,
  titleStyle,
  blueBackgroundStyle,
  contentWrapperStyle,
  skillsCloseBtn,
  buttonStyles,
  dividerStyles,
  textAreaStyles,
  whiteButtonStyle,
};
