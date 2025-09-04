import { css } from "@emotion/react";

const Footer = () => {
  return (
    <div
      css={css`
        width: 100%;
        background-color: #ffffff;
      `}
    >
      <div
        css={css`
          height: 80px;
          color: #5a5a5a;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
        `}
      >
        2024 DevSync, Create developer resumes effortlessly with AI.
      </div>
    </div>
  );
};

export default Footer;
