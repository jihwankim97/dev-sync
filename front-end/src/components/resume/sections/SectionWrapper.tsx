import { css } from "@emotion/react";
import { Button, Typography } from "@mui/material";
import { sectionBar } from "../../../styles/resumeLayerStyle";
import React, { useState } from "react";
import { ConfirmDialog } from "../../../layout/resume/ConfirmDialogLayout";

const contentStyle = css`
  border: 1.5px solid #dbdbdb;
  border-radius: 10px;
  padding: 1.5rem 2.5rem;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;
export const SectionWrapper = ({
  title,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  sectionType, // 추가
  children,
}: {
  title: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete?: () => void;
  sectionType?: string;
  children: React.ReactNode;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div css={contentStyle}>
      <Typography css={titleStyle} variant="h5">
        {title}
      </Typography>
      <div css={sectionBar} />
      {children}
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        {isEditing &&
          (sectionType === "custom" ||
            sectionType === "careers" ||
            sectionType === "achievements") && (
            <Button onClick={() => setConfirmOpen(true)}>삭제</Button>
          )}
        <ConfirmDialog
          open={confirmOpen}
          title="삭제 확인"
          message="정말 삭제하시겠습니까?"
          onConfirm={() => {
            onDelete && onDelete();
            setConfirmOpen(false)

          }}
          onCancel={() => setConfirmOpen(false)}
        />
        <Button
          css={css`
            margin-left: auto;
          `}
          variant="contained"
          onClick={isEditing ? onSave : onEdit}
        >
          {isEditing ? "저장" : "수정"}
        </Button>
      </div>
    </div>
  );
};
