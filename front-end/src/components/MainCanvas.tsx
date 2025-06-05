import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Stage, Text } from "@pixi/react";
import { TextStyle } from "@pixi/text";
import { Button } from "@mui/material";

interface Project {
  name: string;
  description: string;
  outcomes: OutComes[];
  role: string;
}

interface OutComes {
  result: string;
  title: string;
}

interface GitInfo {
  introduction: {
    description: string;
  };
  projects: Project[];
  skills: {
    knowledgeable: string[];
    strengths: string[];
  };
}

interface ChildComponentProps {
  gitInfo: GitInfo;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 2.4;
const WIDTH = A4_WIDTH_MM * MM_TO_PX;
const HEIGHT = A4_HEIGHT_MM * MM_TO_PX;
const LINE_HEIGHT = 12;
const WRAP_WIDTH = WIDTH - 60;
const LINES_PER_PAGE = Math.floor((HEIGHT - 60) / LINE_HEIGHT);

const textStyle = new TextStyle({
  fontSize: 10,
  fill: 0x000000,
  wordWrap: true, // ✅ 줄바꿈 활성화
  wordWrapWidth: WRAP_WIDTH, // ✅ 줄바꿈 기준 너비 설정
  breakWords: true,
});

export const MainCanvas = ({ gitInfo }: ChildComponentProps) => {
  const userData = useSelector((state: any) => state.login.loginInfo);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(3, Math.max(0.5, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPosition.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: lastPosition.current.x + dx,
      y: lastPosition.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      if (testLine.length * 7 < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const drawTexts = () => {
    const pages: JSX.Element[][] = [[]];
    let lineCount = 0;

    const addTextLine = (
      text: string,
      x: number,
      y: number,
      key: string,
      customStyle?: Partial<TextStyle>
    ) => {
      pages[pages.length - 1].push(
        <Text
          key={key + pages.length + lineCount}
          text={text}
          x={x}
          y={y}
          style={new TextStyle({ ...textStyle, ...customStyle })}
          resolution={window.devicePixelRatio}
        />
      );
    };

    const addBlock = (label: string, content: string | string[]) => {
      const labelLines = wrapText(label, WRAP_WIDTH);
      for (const line of labelLines) {
        if (lineCount >= LINES_PER_PAGE) {
          pages.push([]);
          lineCount = 0;
        }
        addTextLine(
          line,
          30,
          30 + lineCount * LINE_HEIGHT,
          `label-${lineCount}`,
          { fontWeight: "bold" }
        );
        lineCount++;
      }

      const lines = Array.isArray(content)
        ? content
        : wrapText(content, WRAP_WIDTH);
      for (const line of lines) {
        if (lineCount >= LINES_PER_PAGE) {
          pages.push([]);
          lineCount = 0;
        }
        addTextLine(
          line,
          50,
          30 + lineCount * LINE_HEIGHT,
          `content-${lineCount}`
        );
        lineCount++;
      }

      lineCount++;
    };

    // User Info
    addBlock("이름", userData.name || "");
    addBlock("이메일", userData.email || "");
    addBlock("Github URL", userData.githubUrl || "");

    // Introduction
    addBlock("소개", gitInfo.introduction.description);

    // Skills
    addBlock("보유 기술", gitInfo.skills.knowledgeable.join(", "));
    addBlock("강점 기술", gitInfo.skills.strengths.join(", "));

    // Projects
    gitInfo.projects.forEach((project, i) => {
      addBlock(`프로젝트 ${i + 1}: ${project.name}`, project.description);
      addBlock("역할", project.role);
      project.outcomes.forEach((outcome, j) => {
        addBlock(`성과 ${j + 1}: ${outcome.title}`, outcome.result);
      });
    });

    return pages;
  };

  const pages = drawTexts();
  const totalPages = pages.length;

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <div
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          backgroundColor: "#d0d0d0",
          overflow: "hidden",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isDragging.current ? "none" : "transform 0.1s ease-out",
          }}
        >
          <Stage
            width={WIDTH}
            height={HEIGHT}
            options={{
              backgroundColor: "white",
              antialias: true,
              resolution: window.devicePixelRatio,
              autoDensity: true,
            }}
          >
            <Container>{pages[currentPage]}</Container>
          </Stage>
        </div>
      </div>

      {/* 페이지 네비게이션 UI */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        <Button
          variant="contained"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          이전 페이지
        </Button>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="contained"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          다음 페이지
        </Button>
      </div>
    </div>
  );
};
