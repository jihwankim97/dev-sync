import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type {
  ResumeData,
  CareersTypeSection,
} from "../../../types/resume.type";
import { SectionWrapper } from "./SectionWrapper";
import { css } from "@emotion/react";
import { TextField, Button, Chip, Typography, Switch } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  gridStyle,
  textFieldStyle,
  dateStyle,
  sectionBar,
} from "../../../styles/resumeLayerStyle";
import { useLocalSection } from "../../../hooks/useLocalSection";
interface Props {
  section: CareersTypeSection;
  setSections?: Dispatch<SetStateAction<ResumeData>>;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export const CareerSection = ({
  section,
  isEditing,
  onEdit,
  onSave,
}: Props) => {
  const { SaveSection, localSection, handleArrayItemChange, DeleteSection, errors } = useLocalSection(
    section,
    onSave
  );
  const [isCurrentArr, setIsCurrentArr] = useState<boolean[]>(localSection.items.map(() => false));

  return (
    <SectionWrapper
      title="경력"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={SaveSection}
      sectionType={section.type}
      onDelete={DeleteSection}
    >
      {localSection.items.map((section, idx) => (
        <div key={section.id}>
          {isEditing ? (
            <div
              css={css`
                align-items: center;
                display: flex;
              `}
            >
              <label
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  cursor: pointer;
                `}
              >
                <input
                  type="checkbox"
                  checked={isCurrentArr[idx]}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newArr = [...isCurrentArr];
                    newArr[idx] = checked;
                    setIsCurrentArr(newArr);
                    if (checked) {
                      handleArrayItemChange(
                        "items",
                        section.id,
                        "endDate",
                        ""
                      );
                    }
                  }}
                  style={{ accentColor: '#1976d2', width: '18px', height: '18px' }}
                />
                <span>재직중</span>
              </label>
            </div>
          ) : null}

          {isEditing ? (
            <>
              <div css={gridStyle}>
                <TextField
                  multiline
                  css={textFieldStyle}
                  value={section.company || ""}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "company",
                      e.target.value
                    )
                  }
                  placeholder="회사명을 입력하세요"
                  label="회사 명 *"
                  error={errors[`items_${idx}_company`] && !section.company}
                  helperText={errors[`items_${idx}_company`] ? "필수값을 적어주세요." : ""}
                />
                <TextField
                  multiline
                  css={textFieldStyle}
                  value={section.position || ""}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "position",
                      e.target.value
                    )
                  }
                  label="직무 *"
                  error={errors[`items_${idx}_position`] && !section.position}
                  helperText={errors[`items_${idx}_position`] ? "필수값을 적어주세요." : ""}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="입사년월 *"
                    css={textFieldStyle}
                    value={section.startDate ? dayjs(section.startDate) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        handleArrayItemChange(
                          "items",
                          section.id,
                          "startDate",
                          formattedDate
                        );
                      }
                    }}
                    slotProps={{
                      textField: {
                        error: errors[`items_${idx}_startDate`] && !section.startDate,
                        helperText: errors[`items_${idx}_startDate`] ? "필수값을 적어주세요." : "",
                      },
                    }}
                  />
                  <DatePicker
                    label="퇴사년월"
                    css={textFieldStyle}
                    disabled={isCurrentArr[idx]}
                    value={section.endDate ? dayjs(section.endDate) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        handleArrayItemChange(
                          "items",
                          section.id,
                          "endDate",
                          formattedDate
                        );
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div
                css={css`
                  margin: 1.5rem 0;
                `}
              >
                <TextField
                  multiline
                  label="담당업무 *"
                  css={css`
                    width: 100%;
                    box-sizing: border-box;
                  `}
                  value={section.description || ""}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      section.id,
                      "description",
                      e.target.value
                    )
                  }
                  error={errors[`items_${idx}_description`] && !section.description}
                  helperText={errors[`items_${idx}_description`] ? "필수값을 적어주세요." : ""}
                />
              </div>
            </>
          ) : (
            <>
              <div
                css={css`
                  display: flex;
                `}
              >
                <Typography
                  css={css`
                    font-weight: bold;
                    margin: 0;
                    font-size: 1.1rem;
                  `}
                >
                  {section.company || ""}
                </Typography>
                <Typography css={dateStyle}>{section.startDate}</Typography>
              </div>
              <Typography
                css={css`
                  margin-bottom: 1rem;
                  font-size: 0.9rem;
                  color: #464646;
                `}
              >
                {section.position}
              </Typography>
              <Typography>{section.description || ""}</Typography>
            </>
          )}
          <div css={sectionBar} />
        </div>
      ))}
    </SectionWrapper>
  );
};
