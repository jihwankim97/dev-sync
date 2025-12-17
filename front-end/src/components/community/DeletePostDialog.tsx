import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RemovePost } from "../../api/RemovePost";

export const DeletePostDialog = ({
  open,
  setOpen,
  postId,
}: {
  postId: number;
  open: boolean;
  setOpen: any;
}) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    console.log(postId);
    await RemovePost(postId);
    setOpen(false);
    navigate(-1);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <WarningOutlinedIcon color="primary" />
          {"게시물 삭제"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            해당 게시물을 삭제 하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#757575" }} onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleDelete}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
