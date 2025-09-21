import type { Dispatch, SetStateAction } from "react";
import type {
  ResumeData,
  ProjectsTypeSection,
} from "../../../types/resume.type";
import { SectionWrapper } from "./SectionWrapper";
import { sectionBar } from "../../../styles/resumeLayerStyle";
import { TextField, Typography, css } from "@mui/material";
import { useLocalSection } from "../../../hooks/useLocalSection";

interface Props {
  section: ProjectsTypeSection;
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

export const ProjectsSection = ({
  section,
  isEditing,
  setSections,
  onEdit,
  onSave,
}: Props) => {
  const { handleChange, SaveSection, localSection, handleArrayItemChange } =
    useLocalSection(section, onSave);

  return (
    <SectionWrapper
      title="프로젝트"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={SaveSection}
      sectionType={section.type}
    >
      {localSection.items.map((project) => (
        <div key={project.id} css={{ marginBottom: "2rem" }}>
          {isEditing ? (
            <section
              css={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                key={project.id}
                css={{
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  css={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <TextField
                    label="프로젝트명"
                    value={project.name}
                    fullWidth
                    onChange={(e) =>
                      handleArrayItemChange(
                        "items",
                        project.id,
                        "name",
                        e.target.value
                      )
                    }
                    size="small"
                    margin="dense"
                  />
                  <TextField
                    label="사용 기술"
                    value={project.skills?.join(", ")}
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      handleArrayItemChange(
                        "items",
                        project.id,
                        "skills",
                        e.target.value
                      )
                    }
                    margin="dense"
                    multiline
                    minRows={2}
                    placeholder="예: React, TypeScript, NestJS"
                  />
                </div>
                <div
                  css={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <TextField
                    label="시작일"
                    value={project.startDate}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "items",
                        project.id,
                        "startDate",
                        e.target.value
                      )
                    }
                    fullWidth
                    size="small"
                    margin="dense"
                  />
                  <TextField
                    label="종료일"
                    value={project.endDate}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "items",
                        project.id,
                        "endDate",
                        e.target.value
                      )
                    }
                    fullWidth
                    size="small"
                    margin="dense"
                  />
                </div>
                <TextField
                  label="설명"
                  value={project.description}
                  onChange={(e) =>
                    handleArrayItemChange(
                      "items",
                      project.id,
                      "description",
                      e.target.value
                    )
                  }
                  fullWidth
                  size="small"
                  margin="dense"
                  multiline
                  minRows={3}
                />
                {project.outcomes.length > 0 && (
                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <Typography
                      css={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#444",
                      }}
                    >
                      관련 성과
                    </Typography>

                    {project.outcomes.map((outcome) => (
                      <div
                        key={outcome.id}
                        css={{
                          borderRadius: "8px",
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.8rem",
                        }}
                      >
                        <TextField
                          label="한 일"
                          value={outcome.task}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "items",
                              project.id,
                              "outcomes",
                              project.outcomes.map((o) =>
                                o.id === outcome.id
                                  ? { ...o, task: e.target.value }
                                  : o
                              )
                            )
                          }
                          fullWidth
                          size="small"
                          margin="dense"
                          multiline
                          minRows={2}
                          sx={{
                            backgroundColor: "#fff",
                          }}
                        />
                        <TextField
                          label="성과"
                          value={outcome.result}
                          sx={{
                            backgroundColor: "#fff",
                          }}
                          onChange={(e) =>
                            handleArrayItemChange(
                              "items",
                              project.id,
                              "outcomes",
                              project.outcomes.map((o) =>
                                o.id === outcome.id
                                  ? { ...o, result: e.target.value }
                                  : o
                              )
                            )
                          }
                          fullWidth
                          size="small"
                          margin="dense"
                          multiline
                          minRows={3}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              <Typography css={{ fontWeight: "bold" }}>
                {project.name}
              </Typography>
              <Typography>설명: {project.description}</Typography>
              <Typography>
                기간: {project.startDate} ~ {project.endDate}
              </Typography>
              <Typography>사용 기술: {project.skills.join(", ")}</Typography>

              {project.outcomes.length > 0 && (
                <div css={{ marginTop: "1rem" }}>
                  <Typography
                    css={css`
                      font-weight: bold;
                      font-size: 1.1rem;
                    `}
                  >
                    관련 성과
                  </Typography>
                  {project.outcomes.map((outcome) => (
                    <div key={outcome.id} css={{ marginBottom: "0.5rem" }}>
                      <Typography>• 한 일: {outcome.task}</Typography>
                      <Typography>→ 성과: {outcome.result}</Typography>
                    </div>
                  ))}
                </div>
              )}
              <div css={sectionBar} />
            </>
          )}
        </div>
      ))}
    </SectionWrapper>
  );
};
