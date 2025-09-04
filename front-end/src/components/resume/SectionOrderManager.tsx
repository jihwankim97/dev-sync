import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Button,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { ResumeData } from "../../types/resume.type";

interface Props {
  order: ResumeData["order"];
  entities: ResumeData["entities"];
}

export const SectionOrderManager = ({
  order,
  entities,
}: // onClose,
Props) => {
  const [localOrder, setLocalOrder] = useState(order);
  const initialOrderRef = useRef<string[]>([]);

  useEffect(() => {
    initialOrderRef.current = order;
  }, []);
  //일단 , 리스트가 변경되면 setLocal 로

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = [...localOrder];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    // onReorder(newOrder);
    setLocalOrder(newOrder);
  };

  return (
    <Fade in>
      <Paper
        elevation={6}
        sx={{
          width: 250,
          height: 400,
          p: 2,
          bgcolor: "#ffffff",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontWeight={600} textAlign="center" mb={1} color="#2f2f2f">
          섹션 순서 변경
        </Typography>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sectionList">
            {(provided) => (
              <List
                dense
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  mb: 1.5,
                }}
              >
                {localOrder.map((id, index) => {
                  const entity = entities.find((i) => i.id === id);
                  if (
                    !entity ||
                    entity.type === "project" ||
                    entity.type === "outcome"
                  ) {
                    return;
                  }
                  const label =
                    entity.type === "custom"
                      ? entity.title
                      : (
                          {
                            profile: "기본 정보",
                            skills: "스킬",
                            projects: "프로젝트",
                            achievements: "수상/자격",
                            careers: "경력",
                            introduction: "자기소개",
                          } as const
                        )[entity.type];

                  return (
                    <Draggable
                      key={id}
                      draggableId={id}
                      index={index}
                      isDragDisabled={entity.type === "profile"}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          disablePadding
                          sx={{
                            background: snapshot.isDragging
                              ? "#f0f8ff"
                              : "transparent",
                          }}
                        >
                          <ListItemButton>
                            <ListItemText primary={label} />
                            {entity.type !== "profile" && (
                              <div
                                {...provided.dragHandleProps}
                                style={{
                                  cursor: "grab",
                                  padding: "4px 6px",
                                  color: "#aaa",
                                }}
                              >
                                ☰
                              </div>
                            )}
                          </ListItemButton>
                        </ListItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={() => setLocalOrder(initialOrderRef.current)}
          >
            취소
          </Button>
          <Button
            variant="contained"
            //  onClick={() => onReorder(localOrder)}
          >
            확인
          </Button>
        </div>
      </Paper>
    </Fade>
  );
};
