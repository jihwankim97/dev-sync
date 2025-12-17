/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button, Popover } from "@mui/material";
import { useState } from "react";

export const OptionBar = ({
  deleteClick,
  editClick,
}: {
  deleteClick: (() => void) | (() => Promise<void>);
  editClick: (() => void) | (() => Promise<void>);
}) => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const post = location.state; // `navigate`에서 전달된 데이터
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        css={css`
          width: 24px;
          height: 24px;
          padding: 0;
          color: #484848;
        `}
        aria-describedby={id}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </Button>

      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top", // popover의 위쪽이 버튼 아래쪽에 맞춰짐
          horizontal: "left", // popover의 왼쪽이 버튼 왼쪽에 맞춰짐
        }}
      >
        <div
          css={css`
                        width: auto;
                        height: auto;
                        font-size: 0.9rem;
                      `}
        >
          <div>
            <button
              css={css`
                background-color: #ffffff;
                color: #000000;
              `}
              onClick={() => {
                editClick();
              }}
            >
              수정
            </button>
          </div>
          <div>
            <button
              css={css`
                background-color: #ffffff;
                color: #000000;
              `}
              onClick={() => {
                deleteClick();
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
};
