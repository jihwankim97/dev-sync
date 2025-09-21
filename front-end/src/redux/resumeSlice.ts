import { createAsyncThunk, createSlice, type Draft, type PayloadAction } from "@reduxjs/toolkit";
import { ResumeSection, ResumeData } from "../types/resume.type";
import { updateSectionAPI } from "../api/UpdateSection";

type ResumeState = ResumeData | null;

export const updateResumeSection = createAsyncThunk<
  ResumeSection,                  // fulfilled 타입
  ResumeSection,                  // argument 타입
  { state: { resumeInfo: ResumeData }; rejectValue: string } // thunkAPI 타입
>("resume/updateSection",
  async (section: ResumeSection, thunkAPI) => {
    const stateBefore = thunkAPI.getState().resumeInfo;

    // 로컬 상태 반영
    thunkAPI.dispatch(updateResume(section));

    try {
      const updatedSection = await updateSectionAPI(section, stateBefore.id);

      return updatedSection; // 서버 값이 다르면 state 갱신
    } catch (error: any) {
      console.error("서버 업데이트 실패:", error);

      // 서버 실패 시 원래 값으로 복원
      if (stateBefore) {
        const originalSection = stateBefore.entities.find(s => s.id === section.id);
        if (originalSection) {
          thunkAPI.dispatch(updateResume(originalSection));
        }
      }

      if (error.validationErrors) {
        return thunkAPI.rejectWithValue(error.validationErrors);
      }

      // rejected 액션으로 처리
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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
    updateOrder(state, action: PayloadAction<string[]>) {
      if (!state) return;
      state.order = action.payload;
    },
    removeSection(state, action: PayloadAction<string>) {
      if (!state) return;
      state.entities = state.entities.filter(section => section.id !== action.payload);
      state.order = state.order.filter(id => id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(updateResumeSection.fulfilled, (state, action) => {
      if (!state) return;
      // 서버에서 반환된 값과 로컬값이 다르면 갱신
      state.entities = state.entities.map(section =>
        section.id === action.payload.id ? action.payload : section
      );
    });

    builder.addCase(updateResumeSection.rejected, (state, action) => {
      console.error("Section update failed:", action.payload || action.error.message);
      // 이미 Thunk 안에서 롤백 처리됨
    });
  }
});

export const { updateResume, setResume, addResume, updateOrder, removeSection } = resumeSlice.actions;
export default resumeSlice.reducer;
