/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const containerStyle = css`
  display: flex;
  margin:  3rem auto 2rem auto;
  flex-direction: column;
  gap: 1rem;
  width : 55%; 
  padding : 2%;
  border-radius : 8px;
  box-shadow: 0 4px 6px rgba(214, 214, 214, 0.3); 
  background-color: #ffffff4d;
  z-index:1;
  position: relative;
   @media (max-width: 768px) {
    width: 90%;
  }
`;

export const itemStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

  &.visible {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const commitAreaStyle = css`
  padding: 1.5rem;
  margin: 0.5rem 1rem;
  background-color: #ffffff;
  border : 1.5px solid #e9e9e9ff;
  border-radius: 5px;
  animation: slide-in 0.3s ease-out;

  @keyframes slide-in {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const commitContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const commitStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const commitHeaderStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right : 7px;
`;

export const textareaStyle = css`
  resize: none;
  padding: 10px;
  font-size: 0.9rem;
  margin : 0 10px;
  background-color: #ffffff;
  color: #000000;
  border : 1.5px solid #469cecff;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #aaa;
  }
`;
