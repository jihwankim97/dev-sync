import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../api/queries/baseQuery";
import { ENDPOINTS } from "../../api/endpoint";
import { useMutation, useQuery } from "@tanstack/react-query";

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => request({ method: "GET", url: ENDPOINTS.auth("logout") }),
    onSuccess: () => {
      window.location.href = "/";
      console.log("로그아웃");
    },
    onError: (error: any) => {
      console.error("로그아웃 실패:", error);
    },
  });

  const handleClick = () => {
    navigate("/users"); // 새로운 경로로 이동
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <Avatar onClick={handleAvatarClick} />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        slotProps={{
          paper: {
            // 그림자 0
            elevation: 0,
            sx: {
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleClick}>내 정보</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>
    </>
  );
};
export default ProfileButton;
