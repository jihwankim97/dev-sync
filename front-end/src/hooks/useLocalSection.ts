import { useCallback, useEffect, useState } from "react";
import { removeSection, updateResume, updateResumeSection } from "../redux/resumeSlice";
import type { OutcomeTypeSection, ResumeSection } from "../types/resume.type";
import dayjs from "dayjs";
import { useAppDispatch } from "./useAppDispatch";
import { useDispatch, useSelector } from "react-redux";


export const useLocalSection = <T extends ResumeSection>(
  section: T,
  onSave: () => void
) => {
  const [localSection, setLocalSection] = useState<T>(section);
  const dispatch = useAppDispatch();
  const localDispatch = useDispatch();
  const resumeId = useSelector((state: { resumeInfo: { id: string; }; }) => state.resumeInfo?.id);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLocalSection(section);
    console.log(section)
  }, [section]);

  const handleChange = useCallback(
    (key: string, value: number | string | typeof dayjs | undefined) => {
      setLocalSection((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleArrayItemChange = useCallback(
    (
      key: string,
      itemId: string,
      field: string,
      value: string | number | OutcomeTypeSection[]
    ) => {
      setLocalSection((prev) => {
        const array = (prev as any)[key];
        if (Array.isArray(array)) {
          return {
            ...prev,
            [key]: array.map((item: any) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          };
        }
        return prev;
      });
    },
    []
  );
  const removeTempPrefix = (id: string) => id.startsWith("temp-") ? id.slice(5) : id;

  const SaveSection = async () => {
    // 타입이 careers, achievements, custom인 경우 id에서 temp- 제거
    let sectionToSave: any = localSection;
    if (
      localSection.type === "careers" ||
      localSection.type === "achievements" ||
      localSection.type === "custom"
    ) {
      sectionToSave = {
        ...localSection,
        id: removeTempPrefix(localSection.id),
      };
    }
    try {
      await dispatch(updateResumeSection(sectionToSave)).unwrap();
      setErrors({}); // 성공 시 에러 초기화
      onSave();
    } catch (error: any) {
      const fieldErrors: { [key: string]: boolean } = {};

      error.forEach((err: { field: string }) => {
        fieldErrors[err.field] = true; // true면 빨간 테두리
      });
      setErrors(fieldErrors);
    }
  }
  const DeleteSection = async () => {
    if (section.id.startsWith("temp-")) {
      // setResume을 dispatch해서 로컬 상태만 업데이트
      localDispatch(removeSection(section.id));
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/resumes/${resumeId}/${section.type}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      );
      if (!response.ok) {
        throw new Error("Failed to delete section");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return { handleChange, SaveSection, localSection, handleArrayItemChange, errors, DeleteSection };
};
