import type { Dispatch, SetStateAction } from "react";
import type { ResumeData, CustomTypeSection } from "../../../types/resume.type";
import { SectionWrapper } from "./SectionWrapper";
import { textareaStyle } from "../../../styles/resumeLayerStyle";
import { TextField, Typography, css } from "@mui/material";
import { useLocalSection } from "../../../hooks/useLocalSection";

interface Props {
  section: CustomTypeSection;
  setSections?: Dispatch<SetStateAction<ResumeData>>;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

interface Props {
  label?: string;
  value?: string;
  type?: string;
  placeholder?: string;
  startAdornmentText?: string;
}

export const CustomSection = ({
  section,
  isEditing,
  onEdit,
  onSave,
}: Props) => {
  const { handleChange, SaveSection, localSection, DeleteSection, errors } = useLocalSection(
    section,
    onSave
  );

  return (
    <SectionWrapper
      title={
        isEditing ? (
          <TextField
            css={css`
              width: 100%;
              height: 100%;
              overflow: auto;
            `}
            value={localSection.title || ""}
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
            placeholder="섹션 제목을 입력하세요"
            fullWidth
            error={!!errors.title && !localSection.title}
            helperText={errors.title ? "필수값을 적어주세요." : ""}
          />
        ) : (
          <Typography variant="h5">
            {section.title || "사용자 정의 섹션"}
          </Typography>
        )
      }
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={SaveSection}
      sectionType={section.type}
      onDelete={DeleteSection}

    >
      {isEditing ? (
        <>
          <TextField
            multiline
            css={textareaStyle}
            value={localSection.description || ""}
            placeholder="설명을 입력하세요"
            onChange={(e) => {
              handleChange("description", e.target.value);
            }}
            minRows={4}
            error={!!errors.description && !localSection.description}
            helperText={errors.description ? "필수값을 적어주세요." : ""}
          />
        </>
      ) : (
        <>
          <Typography>{section.description || ""}</Typography>
        </>
      )}
    </SectionWrapper>
  );
};
