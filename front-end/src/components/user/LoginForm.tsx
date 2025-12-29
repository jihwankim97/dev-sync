import { Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginForm } from "../../redux/loginSlice";
import styled from "@emotion/styled";

const StyledButton = styled.button`
  margin: 8px 16px;
  padding: 12px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

const GoogleButton = styled(StyledButton)`
  background-color: #ffffff;
  color: black;
  margin-top: 8px;
  margin-bottom: 16px;
  border: 1px solid #e3e3e3ff;
`;

const GithubButton = styled(StyledButton)`
  background-color: #f5f5f5ef;
  border: 1px solid #e3e3e3ff;
  color: black;
  margin-bottom: 24px;
`;

const LoginForm = () => {
  const dialogOpen = useSelector((state: any) => state.login.loginForm);
  const mode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            m: 10,
            p: 3,
            borderRadius: 1,
            maxWidth: 400,
            minWidth: 200,
            backgroundColor: mode === "dark" ? "#111111da" : undefined,
          },
        },
      }}
      open={dialogOpen}
      onClose={() => dispatch(closeLoginForm())}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: 20,
          color: mode === "dark" ? "#e7e7e7ff" : "#3764a0ff",
          m: 0,
          pr: 10,
          pl: 10,
          pt: 3,
          pb: 3,
        }}
      >
        로그인
      </DialogTitle>
      <IconButton
        size="small"
        disableRipple
        aria-label="close"
        sx={{
          position: "absolute",
          right: 7,
          top: 7,
          "&:focus": { outline: "none" },
          color: mode === "dark" ? "#a0a0a0" : "#767676",
        }}
        onClick={() => dispatch(closeLoginForm())}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <GoogleButton onClick={handleGoogleLogin}>
        <img src={"/google_logo.webp"} width={20} height={20} alt="Google" />
        구글 간편 로그인
      </GoogleButton>
      <GithubButton onClick={handleGithubLogin}>
        <img src="/github_logo.webp" width={20} height={20} alt="GitHub" />
        깃허브 간편 로그인
      </GithubButton>
    </Dialog>
  );
};

export default LoginForm;
