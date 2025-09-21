import type { Dispatch, SetStateAction } from "react";
import type {
  ResumeData,
  IntroductionTypeSection,
} from "../../../types/resume.type";
import { SectionWrapper } from "./SectionWrapper";
import {
  textareaStyle,
  titleTextFieldStyle,
} from "../../../styles/resumeLayerStyle";
import { TextField, Typography, css } from "@mui/material";
import { useLocalSection } from "../../../hooks/useLocalSection";

interface Props {
  section: IntroductionTypeSection;
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

export const IntroductionSection = ({
  section,
  isEditing,
  setSections,
  onEdit,
  onSave,
}: Props) => {
  const { handleChange, SaveSection, localSection } = useLocalSection(
    section,
    onSave
  );
  return (
    <SectionWrapper
      title="자기소개"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={SaveSection}
      sectionType={section.type}
    >
      {isEditing ? (
        <>
          <TextField
            multiline
            css={titleTextFieldStyle}
            value={localSection.headline || ""}
            onChange={(e) => {
              handleChange("headline", e.target.value);
            }}
            placeholder="제목을 입력하세요"
          />
          <TextField
            multiline
            css={textareaStyle}
            value={localSection.description || ""}
            onChange={(e) => {
              handleChange("description", e.target.value);
            }}
            placeholder="자기소개를 입력하세요"
          />
        </>
      ) : (
        <>
          <Typography
            css={css`
              margin-bottom: 1rem;
            `}
          >
            {section.headline || ""}
          </Typography>
          <Typography>{section.description || ""}</Typography>
        </>
      )}
    </SectionWrapper>
  );
};
