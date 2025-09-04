import { createSlice, type Draft, type PayloadAction } from "@reduxjs/toolkit";
import { ResumeSection, ResumeData } from "../types/resume.type";

type ResumeState = ResumeData | null;

// order에서 해당 id 찾아서 있으면, entitiy에서  해당 아이디로 들어가서 업데이트
const resumeSlice = createSlice({
  name: "resumeInfo",
  initialState: null as ResumeState,
  reducers: {
    //전체 저장
    setResume(state: ResumeState, action: PayloadAction<ResumeData>) {
      return action.payload;
    },
    updateResume<T extends ResumeSection>(
      state: ResumeState,
      action: PayloadAction<T>
    ) {
      if (!state) return;
      state.entities = state.entities.map((section) =>
        section.id === action.payload.id ? action.payload : section
      );
    },
    addResume(
      state,
      action: PayloadAction<(draft: Draft<ResumeData>) => void>
    ) {
      // state는 Immer draft 상태
      if (!state) return;
      action.payload(state); // 내부에서 바로 수정 가능
    },
  },
});

export const { updateResume, setResume, addResume } = resumeSlice.actions;
export default resumeSlice.reducer;
