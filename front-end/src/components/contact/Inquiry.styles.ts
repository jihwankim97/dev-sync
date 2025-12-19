/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// 화면 전체 스타일
export const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ffffff;
  font-family: "Arial", sans-serif;
`;

// 카드형 콘텐츠 스타일
export const card = css`
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

// 제목 스타일
export const title = css`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
`;

// 입력 그룹 스타일
export const inputGroup = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;

  label {
    font-weight: bold;
    color: #555;
  }

  input {
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

  button {
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
  }
`;

// 문의사항 리스트 스타일
export const inquiryList = css`
  list-style: none;
  padding: 0;
  margin: 20px 0;

  li {
    background: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    text-align: left;
    color: #333;
  }

  p {
    margin: 5px 0;
  }

  p:first-of-type {
    font-weight: bold;
  }
`;

// 문의하기 버튼 스타일
export const bottomButton = css`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #218838;
  }
`;
