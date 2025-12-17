import React, { useState, type Dispatch, type SetStateAction } from "react";
import {
  Popover,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  css,
} from "@mui/material";
import type {
  AchievementItem,
  AchievementsTypeSection,
  CareerItem,
  CareersTypeSection,
} from "../../types/resume.type";
import { addResume } from "../../redux/resumeSlice";
import { useDispatch } from "react-redux";

const sectionTemplates = {
  career: {
    id: "",
    type: "career",
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  },
  achievement: {
    id: "",
    type: "achievement",
    title: "",
    organization: "",
    date: "",
    description: "",
  },
  custom: {
    id: "",
    type: "custom",
    title: "",
    description: "",
  },
} as const;

export const CreateSection = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleAddSection = (type: "career" | "achievement" | "custom") => {
    if (type === "career" || type === "achievement") {
      const sectionKey = type === "career" ? "careers" : "achievements";

      dispatch(
        addResume((draft) => {
          const existingSection = draft.entities.find(
            (s) => s.type === sectionKey
          ) as CareersTypeSection | AchievementsTypeSection | undefined;

          const newItem: CareerItem | AchievementItem = (() => {
            if (type === "career") {
              return {
                id: crypto.randomUUID(),
                company: "",
                position: "",
                startDate: "",
                endDate: " ",
                description: "",
              };
            } else {
              return {
                id: crypto.randomUUID(),
                title: "",
                organization: "",
                date: "",
                description: "",
              };
            }
          })();

          if (existingSection) {
            // 기존 섹션에 items 추가
            if (existingSection.type === "careers") {
              existingSection.items.push(newItem as CareerItem);
            } else if (existingSection.type === "achievements") {
              existingSection.items.push(newItem as AchievementItem);
            }
          } else {
            // 새 섹션 생성
            const newSection =
              type === "career"
                ? {
                  id: "temp-careers",
                  type: "careers" as const,
                  items: [newItem as CareerItem],
                }
                : {
                  id: "temp-achievements",
                  type: "achievements" as const,
                  items: [newItem as AchievementItem],
                };

            draft.entities.push(newSection);
            draft.order.push(newSection.id);
          }
        })
      );
    } else if (type === "custom") {
      // custom은 섹션 자체를 새로 추가
      const newSection = {
        ...sectionTemplates.custom,
        id: "temp-" + crypto.randomUUID(),
      };
      dispatch(
        addResume((draft) => {
          draft.entities.push(newSection);
          draft.order.push(newSection.id);
        })
      );
    }

    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
        css={css`
          text-align: center;
        `}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={handleOpen}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          + 섹션 추가하기
        </Button>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(8, 8, 8, 0.315)",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "grid",
            gap: 2,
            width: 220,
          }}
        >
          {[
            { type: "career", label: "경력", desc: "회사, 직무, 기간 기록" },
            {
              type: "achievement",
              label: "자격증 / 수상",
              desc: "자격증, 수상 이력 기록",
            },
            { type: "custom", label: "기본", desc: "봉사활동, 기타 작성" },
          ].map(({ type, label, desc }) => (
            <Card
              key={type}
              sx={{
                cursor: "pointer",
                boxShadow: "none",
                border: "1px solid #cdcbcb",
                borderRadius: "12px",
                "&:hover": { background: "#dfdfdf6b" },
              }}
              onClick={() =>
                handleAddSection(type as keyof typeof sectionTemplates)
              }
            >
              <CardContent>
                <Typography
                  variant="body1"
                  css={css`
                    font-weight: bold;
                  `}
                >
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Popover>
    </>
  );
};
