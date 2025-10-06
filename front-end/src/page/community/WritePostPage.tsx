/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Quill from "quill";
import { ImageResize } from "quill-image-resize-module-ts";
import "quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import { useLocation, useNavigate } from "react-router-dom";
import { EditContentSave } from "../../api/EditContentSave";
import useFetchCategories from "../../api/FetchCategories";

// 타입 선언
declare global {
  interface Window {
    Quill: typeof Quill;
  }
}

// // window에 Quill 등록
if (typeof window !== "undefined") {
  window.Quill = Quill;
  Quill.register("modules/imageResize", ImageResize); // Quill 초기화 전에 모듈 등록
}

const titleStyle = css`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const selectStyle = css`
  margin-bottom: 15px;
`;

const inputStyle = css`
  margin-bottom: 15px;
`;

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }], // 폰트 크기
    [{ align: [] }], // 정렬 (왼쪽, 가운데, 오른쪽, 양쪽 정렬)
    ["bold", "italic", "underline", "strike"], // 기본 스타일
    [{ color: [] }, { background: [] }], // 글자 색상, 배경 색상
    [{ list: "ordered" }, { list: "bullet" }], // 리스트
    ["image"], // 이미지, 링크 추가
  ],
  imageResize: {
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

export const WritePostPage = () => {
  const { quill, quillRef } = useQuill({ modules });
  const { categories } = useFetchCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.from || ""
  );
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  //편집클릭시 quill에 기존 내용 load
  useEffect(() => {
    if (quill && location?.state?.edit) {
      quill.clipboard.dangerouslyPasteHTML(location.state.content);
      setTitle(location.state.title);
    }
  }, [quill, location?.state?.edit]);

  const splitFileName = (
    fileName: string
  ): { baseName: string; extension: string } => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) return { baseName: fileName, extension: "" };
    return {
      baseName: fileName.slice(0, lastDotIndex).replace(/\(\d+\)$/, ""),
      extension: fileName.slice(lastDotIndex),
    };
  };

  const uniqueFileName = (name: string, existingFiles: File[]): string => {
    if (!name) return "file";

    const { baseName, extension } = splitFileName(name);

    let newName = `${baseName}${extension}`;
    let counter = 1;

    // 중복된 파일명이 존재하면 숫자를 붙여서 유니크한 이름 생성
    while (existingFiles.some((file) => file.name === newName)) {
      newName = `${baseName}(${counter})${extension}`;
      counter++;
    }
    return newName;
  };

  const handleContentLoad = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];

      // 중복된 파일명 처리
      const fileName = uniqueFileName(file.name, uploadedFiles);
      const uniqueFile = new File([file], fileName, { type: file.type });

      // 파일 미리보기 삽입
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const range = quill?.getSelection(true);
        const customImageTag = `<img src="${imageUrl}" alt="${uniqueFile.name}"/>`;
        // quill?.clipboard.dangerouslyPasteHTML(range?.index, customImageTag);
        if (range) {
          quill?.clipboard.dangerouslyPasteHTML(range.index, customImageTag);
        }

        // 파일 상태 업데이트
        setUploadedFiles((prevFiles) => [...prevFiles, uniqueFile]);
      };
      reader.readAsDataURL(file);
    };
  };

  // 에디터 내 삭제된 이미지를 감지하고 동기화
  useEffect(() => {
    if (quill) {
      // 에디터 내부 이미지 크기 제한
      const editor = quill.root;
      editor.querySelectorAll("img").forEach((img) => {
        img.style.maxWidth = "50%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "10px auto";
      });
      quill.on("text-change", () => {
        const editorContent = quill.root.innerHTML;

        // 에디터 내 존재하는 이미지 스타일 재적용
        const parser = new DOMParser();
        const doc = parser.parseFromString(editorContent, "text/html");
        const images = doc.querySelectorAll("img");
        images.forEach((img) => {
          img.style.maxWidth = "50%";
          img.style.height = "auto";
          img.style.display = "block";
          img.style.margin = "10px auto";
        });

        // 현재 에디터 내 존재하는 이미지 파일 이름 수집
        const currentImages = doc.querySelectorAll("img");

        const existingAlts = Array.from(currentImages).map(
          (img) => img.getAttribute("alt") || ""
        );

        // uploadedFiles에서 에디터에 없는 파일 제거
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => existingAlts.includes(file.name))
        );
      });

      // 툴바에 커스텀 핸들러 등록
      const toolbar = quill.getModule("toolbar") as any;
      if (toolbar && typeof toolbar.addHandler === "function") {
        toolbar.addHandler("image", handleContentLoad);
      }
    }
  }, [quill, handleContentLoad]);

  const handleContentSave = async () => {
    if (quill) {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });
      try {
        const response = await fetch("http://localhost:3000/post/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) throw new Error("이미지 업로드 실패");

        const result = await response.json();
        const uploadedUrls = result.fileUrls;
        const postId = Number(result.postId);

        const escapeRegex = (str: string) =>
          str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // 에디터에 업로드된 이미지 URL 반영
        let editorContent = quill.root.innerHTML;
        uploadedFiles.forEach((file) => {
          const uploadedUrl = uploadedUrls[file.name]; // 파일 이름으로 URL 찾기
          if (!uploadedUrl) return;

          // 모든 base64 형식의 src 제거
          const removeBase64 = /(<img[^>]*?)\s*src="data:image[^"]+"([^>]*>)/g;

          editorContent = editorContent.replace(
            removeBase64,
            "$1$2" // src 속성 제거, 나머지는 그대로 유지
          );
          // 2️⃣ 새로운 URL 삽입
          const safeAlt = escapeRegex(file.name);
          const insertUrlRegex = new RegExp(
            `<img([^>]*alt="${safeAlt}"[^>]*)>`,
            "g"
          );
          editorContent = editorContent.replace(
            insertUrlRegex,
            `<img$1 src="${uploadedUrl}">`
          );
        });

        if (location?.state?.edit) {
          quill.root.innerHTML = editorContent;

          const result = await EditContentSave({
            title: title,
            content: quill.root.innerHTML,
            postId: location.state.post_id,
            category: selectedCategory,
          });
          const updatedPost = {
            ...result,
            viewCount: result.viewCount + 1,
          };
          navigate(`/community/post/${result.post_id}`, { state: updatedPost });
        } else {
          // 최종 업데이트된 HTML을 적용 (quill 에디터에 다시 삽입)

          quill.root.innerHTML = editorContent;
          handleSave(quill.root.innerHTML, postId);
        }
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
      }
    }
  };

  const handleSave = async (contentData: string, postId: number) => {
    const response = await fetch("http://localhost:3000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",

      body: JSON.stringify({
        postId: postId,
        title: title,
        content: contentData, // 여기서 바로 받은 데이터 사용
        category: selectedCategory,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const updatedPost = {
        ...result,
        viewCount: result.viewCount + 1,
      };
      navigate(`/community/post/${result.postId}`, { state: updatedPost });
      console.log("이미지 업로드 성공");
    } else {
      const error = await response.json();
      console.error("Update failed:", error, response);
    }
  };

  const changeCategory = (e: any) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    if (
      categories.length > 0 &&
      !categories.some((c) => c.category === selectedCategory)
    ) {
      setSelectedCategory(categories[0].category);
    }
  }, [categories]);

  return (
    <div
      css={css`
        margin: 5% 25%;
      `}
    >
      <h2 css={titleStyle}>✏️ 글쓰기</h2>

      {categories.length === 0 ? (
        <CircularProgress />
      ) : (
        <Select
          value={selectedCategory}
          onChange={changeCategory}
          css={selectStyle}
          fullWidth
        >
          {categories
            .filter(
              (i) => i.category == "자유게시판" || i.category == "질문게시판"
            )
            .map((i, idx) => (
              <MenuItem key={idx} value={i.category}>
                {i.category}
              </MenuItem>
            ))}
        </Select>
      )}
      {/* 제목 입력 */}
      <TextField
        label="제목"
        variant="outlined"
        fullWidth
        css={inputStyle}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 본문 입력 */}
      <div style={{ height: "20rem" }}>
        <div ref={quillRef} />
      </div>
      {/* 버튼 */}
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "5rem" }}
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginRight: "0.5rem" }}
          onClick={() => {
            navigate("/community");
            //이동시 스크롤 맨위
            window.scrollTo(0, 0);
          }}
        >
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={handleContentSave}>
          {location?.state?.edit ? "수정" : "등록"}
        </Button>
      </Box>
    </div>
  );
};
