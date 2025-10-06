/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/one_logo.png";
import { useNavigate } from "react-router-dom";

interface Props {
  onDownloadPdf: () => void;
  setTheme: (theme: "modern" | "blueGray") => void;
}

export const ResumeOptionBar = ({ onDownloadPdf, setTheme }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeSelect = (theme: "modern" | "blueGray") => {
    setTheme(theme);
    setAnchorEl(null);
  };

  return (
    <div
      css={css`
        width: 100%;
        height: 4.9em;
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem 0 1rem;
        position: sticky;
        top: 0;
        z-index: 10;
        box-sizing: border-box;
      `}
    >
      <div
        css={css`
          padding-top: 0.3rem;
          font-size: 1.6rem;
          font-weight: 600;
        `}
      >
        <img
          src={logo}
          alt="로고"
          css={css`
            margin-left: 10px;
            height: 23px;
            cursor: pointer;
          `}
          onClick={() => navigate("/")}
        />
      </div>

      <div
        css={css`
          display: flex;
          gap: 1rem;
        `}
      >
        <Button onClick={handleThemeClick}>테마 변경</Button>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleThemeSelect("modern")}>
            Modern
          </MenuItem>
          <MenuItem onClick={() => handleThemeSelect("blueGray")}>
            Blue Gray
          </MenuItem>
        </Menu>

        <Button>저장하기</Button>
        <Button onClick={onDownloadPdf}>PDF 출력</Button>
      </div>
    </div>
  );
};
