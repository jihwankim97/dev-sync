import { Dialog, DialogTitle, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginForm } from "../../redux/loginSlice";

const LoginForm = () => {
  const dialogOpen = useSelector((state: any) => state.login.loginForm);
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            m: 4, // 여백 적용
            p: 2, // 내부 패딩
            borderRadius: 2,
            maxWidth: 300, // 원하는 너비 제한
            minWidth: 100,
          },
        },
      }}
      open={dialogOpen}
      onClose={() => dispatch(closeLoginForm())}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#3369c7",
          m: 0,
          pr: 15,
          pl: 15,
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
          right: 0,
          top: 0,
          "&:focus": { outline: "none" },
          color: "#767676",
        }}
        onClick={() => dispatch(closeLoginForm())}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <Button
        variant="contained"
        sx={{ ml: 2, mr: 2, mt: 1, mb: 3 }}
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </Button>
      <Button variant="contained" sx={{ ml: 2, mr: 2, mt: 1, mb: 3 }}>
        Continue with Kakao
      </Button>
    </Dialog>
  );
};

export default LoginForm;
