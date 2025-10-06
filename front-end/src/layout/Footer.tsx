import { css } from "@emotion/react";

const Footer = () => {
  return (
    <div
      css={css`
          color: #5a5a5a;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15px;
          height: 100%;
        `}
    >
      2024 DevSync, Create developer resumes effortlessly with AI.
    </div>
  );
};

export default Footer;
