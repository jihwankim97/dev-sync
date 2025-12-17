/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// 화면 전체 스타일
export const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  font-family: "Arial", sans-serif;
`;

// 카드형 폼 스타일
export const card = css`
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: left;
`;

// 제목 스타일
export const title = css`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

// 폼 그룹 스타일
export const formGroup = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;

  label {
    font-weight: bold;
    color: #555;
  }

  input,
  textarea {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #5c98f2;
      box-shadow: 0 0 5px rgba(92, 152, 242, 0.4);
    }
  }

  textarea {
    resize: none;
    height: 120px;
  }
`;

// 제출 버튼 스타일
export const submitButton = css`
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #5c98f2, #3b82f6);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    transform: translateY(-2px);
  }
`;

export const successMessage = css`
  color: #28a745;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 20px;
`;
