import { useCallback, useEffect, useState } from "react";
import { updateResume, updateResumeSection } from "../redux/resumeSlice";
import type { OutcomeTypeSection, ResumeSection } from "../types/resume.type";
import dayjs from "dayjs";
import { useAppDispatch } from "./useAppDispatch";

export const useLocalSection = <T extends ResumeSection>(
  section: T,
  onSave: () => void
) => {
  const [localSection, setLocalSection] = useState<T>(section);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const handleChange = useCallback(
    (key: string, value: number | string | typeof dayjs) => {
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
        console.log(array, key);
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
  const SaveSection = () => {
    dispatch(updateResumeSection(localSection));
    onSave();
  };

  return { handleChange, SaveSection, localSection, handleArrayItemChange };
};
