import { Box, css } from "@mui/material";
import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <div
      css={css`
        width: 100%;
        margin: 0 auto;
        overflow-y: hidden;
        border: "5px solid #708216";
      `}
    >
      <Outlet />
    </div>
  );
};
export default Content;
