import { useCallback, useEffect, useState } from "react";
import { updateResume } from "../redux/resumeSlice";
import { useDispatch } from "react-redux";
import type { OutcomeTypeSection, ResumeSection } from "../types/resume.type";
import dayjs from "dayjs";

export const useLocalSection = <T extends ResumeSection>(
  section: T,
  onSave: () => void
) => {
  const [localSection, setLocalSection] = useState<T>(section);
  const dispatch = useDispatch();

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
    dispatch(updateResume(localSection));
    console.log("저장시", localSection);
    onSave();
  };

  return { handleChange, SaveSection, localSection, handleArrayItemChange };
};
