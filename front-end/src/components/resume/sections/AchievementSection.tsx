import type { Dispatch, SetStateAction } from "react";
import type {
  ResumeData,
  AchievementsTypeSection,
  AchievementItem,
} from "../../../types/resume.type";
import { SectionWrapper } from "./SectionWrapper";
import { gridStyle, textareaStyle } from "../../../styles/resumeLayerStyle";
import { css, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useLocalSection } from "../../../hooks/useLocalSection";
interface Props {
  section: AchievementsTypeSection;
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

export const AchievementSection = ({
  section,
  isEditing,
  onEdit,
  onSave,
}: Props) => {
  const { handleChange, SaveSection, localSection, handleArrayItemChange } =
    useLocalSection(section, onSave);
  return (
    <SectionWrapper
      title="자격증 및 수상내역"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={SaveSection}
    >
      {localSection.items.map((section) => (
        <div
          css={css`
            // padding: 2rem;
          `}
          key={section.id}
        >
          {isEditing ? (
            <div>
              <div
                css={css`
                  display: flex;
                  gap: 1rem;
                  margin-bottom: 1rem;
                `}
              >
                <TextField
                  label="항목명"
                  value={section.title}
                  security=""
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "title",
                      e.target.value
                    )
                  }
                  fullWidth
                  size="small"
                  margin="dense"
                />
                <TextField
                  label="발행기관"
                  value={section.organization}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "organization",
                      e.target.value
                    )
                  }
                  fullWidth
                  size="small"
                  margin="dense"
                />
              </div>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="취득일"
                    value={section.date ? dayjs(section.date) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        handleArrayItemChange(
                          "items",
                          section.id,
                          "date",
                          formattedDate
                        );
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>

                <TextField
                  label="설명"
                  rows="4"
                  value={section.description}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "description",
                      e.target.value
                    )
                  }
                  css={[
                    textareaStyle,
                    css`
                      margin-top: 1rem;
                    `,
                  ]}
                  multiline
                />
              </div>
            </div>
          ) : (
            <div
              css={css`
                width: 100%;
              `}
            >
              <Typography>{section.title}</Typography>
              <Typography> {section.organization}</Typography>
              <Typography>{section.date}</Typography>
              <Typography> {section.description}</Typography>
            </div>
          )}
        </div>
      ))}
    </SectionWrapper>
  );
};
