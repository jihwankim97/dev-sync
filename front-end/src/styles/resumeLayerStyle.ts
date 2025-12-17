import { css } from "@emotion/react";

export const contentStyle = css`
  border: 1.5px solid #dbdbdb;
  border-radius: 10px;
  padding: 1.5rem 2.5rem;
  margin-bottom: 2rem;
`;

export const titleStyle = css`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 800px;
  margin: 2rem auto;
`;

export const textFieldStyle = css`
  width: 100%;
`;

export const textareaStyle = css`
  width: 100%;
  box-sizing: border-box;
`;

export const titleTextFieldStyle = css`
  width: 100%;
  height: 100%;
  overflow: auto;
  margin-bottom: 1rem;
`;

export const rowStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 0px;
`;

export const skillListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const dateStyle = css`
  color: #787878;
  margin: 0;
  display: flex;
  align-items: center;
  &::before {
    content: "";
    display: inline-block;
    margin: 0 8px;
    width: 1px;
    height: 12px;
    background: #757575;
  }
`;

export const sectionBar = css`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0; /* 연한 그레이 */
  margin: 1rem 0;
`;

export const chipIcon = css`
  margin-right: 5px;
  font-size: 1.1rem;
  position: relative;
  top: 2px;
`;
