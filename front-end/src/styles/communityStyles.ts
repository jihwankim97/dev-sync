/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// 커뮤니티 페이지 상단 컨테이너
export const communityContainer = (mode: string) => css`
  display: flex;
  padding: 3rem 0;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 1200px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// 좌측 네비게이션 영역
export const sidebarNav = (mode: string) => css`
  min-height: 80vh;
  margin-right: 2rem;
`;

// 사이드바 카테고리 버튼
export const categoryButton = (mode: string, active: boolean) => css`
  width: 100%;
  padding: 0rem 0rem 2rem 0rem;
  text-align: center;
  border: none;
  background: none;
  font-weight: bold;
  color: ${active
    ? mode === "dark"
      ? "#58a6ff"
      : "#2264d6f5"
    : mode === "dark"
      ? "#c9d1d9"
      : "#6d6d6dff"};
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${mode === "dark" ? "#ffffff" : "#8d8d8df5"};
  }
`;

// 우측 콘텐츠 영역 래퍼
export const contentArea = css`
  padding: 0 0rem;
  max-width: 1000px;
  box-sizing: border-box;
  flex: 0 1 1000px;
`;

// --- 공용 검색바 스타일 ---
export const searchContainer = css`
  display: flex;
  margin-bottom: 1rem;
  gap: 1rem;
`;

export const select = (mode: string) => css`
  width: 140px;
  padding: 8px 12px;
  background-color: ${mode === "dark" ? "rgba(29, 35, 44, 0.8)" : "white"};
  border: 1px solid ${mode === "dark" ? "rgba(240, 246, 252, 0.1)" : "#ccc"};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: ${mode === "dark" ? "#c9d1d9" : "#000"};

  &:focus {
    outline: none;
    border-color: ${mode === "dark" ? "#58a6ff" : "#1976d2"};
  }
`;

export const inputContainer = css`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

export const input = (mode: string) => css`
  width: 100%;
  padding: 8px 12px 8px 40px;
  background-color: ${mode === "dark" ? "rgba(22, 27, 34, 0.8)" : "white"};
  border: 1px solid ${mode === "dark" ? "rgba(240, 246, 252, 0.1)" : "#ccc"};
  border-radius: 4px;
  font-size: 14px;
  color: ${mode === "dark" ? "#c9d1d9" : "#000"};

  &:focus {
    outline: none;
    border-color: ${mode === "dark" ? "#58a6ff" : "#1976d2"};
  }

  &::placeholder {
    color: ${mode === "dark" ? "#8b949e" : "#999"};
  }
`;

export const searchIcon = (mode: string) => css`
  position: absolute;
  left: 12px;
  color: ${mode === "dark" ? "#8b949e" : "#666"};
  pointer-events: none;
  z-index: 1;
`;

// --- 게시물 리스트 스타일 ---
export const list = (mode: string) => css`
  background-color: ${mode === "dark" ? "none" : "#fff"};
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 8px;
`;

export const listItem = (mode: string) => css`
  padding: 14px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${mode === "dark" ? "rgba(49, 58, 71, 0.27)" : "#f6f6f6"};
  }
`;

export const listItemText = css`
  flex: 1;
  margin: 0;
`;

export const primaryText = (mode: string) => css`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: ${mode === "dark" ? "#f0f0f0ff" : "#131313ff"};
  line-height: 1.5;
`;

export const secondaryText = (mode: string) => css`
  font-size: 12px;
  color: ${mode === "dark" ? "#c9d1d9" : "#666"};
  margin: 0;
  line-height: 1.43;
`;

export const dividerLine = (mode: string) => css`
  border: none;
  border-top: 1px solid ${mode === "dark" ? "rgba(240, 246, 252, 0.08)" : "rgba(0,0,0,0.12)"};
  height: 1px;
`;

export const iconContainer = (mode: string) => css`
  position: absolute;
  bottom: 4px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${mode === "dark" ? "#8b949e" : "gray"};
`;

export const iconText = (mode: string) => css`
  font-size: 13px;
  margin: 0;
  color: ${mode === "dark" ? "#c9d1d9" : "inherit"};
`;

export const paginationContainer = css`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
`;

export const pagerButton = (mode: string) => css`
  padding: 6px 16px;
  font-size: 14px;
  background-color: ${mode === "dark" ? "rgba(22, 27, 34, 0.8)" : "#f7f7f8"};
  border: 1px solid ${mode === "dark" ? "rgba(240, 246, 252, 0.1)" : "#ccc"};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${mode === "dark" ? "rgba(30, 40, 50, 0.8)" : "#e0e0e0"};
  }
`;

export const pageButton = (mode: string, active: boolean) => css`
  padding: 3px 6px;
  font-size: 12px;
  background-color: ${active ? (mode === "dark" ? "rgba(30, 40, 50, 0.8)" : "#e3f2fd") : (mode === "dark" ? "rgba(22, 27, 34, 0.8)" : "#f7f7f8")};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${active ? (mode === "dark" ? "#58a6ff" : "hsl(216,55%,39%)") : (mode === "dark" ? "#c9d1d9" : "black")};

  &:hover {
    background-color: ${mode === "dark" ? "rgba(30, 40, 50, 0.8)" : "#cacaca"};
  }
`;
