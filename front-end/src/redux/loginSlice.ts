// slice - 객체 관련 상태 , 분리체계
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  loggedIn: boolean;
  loginForm: boolean;
}

const initialState: LoginState = {
  loggedIn: false,
  loginForm: false,
};
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setloggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    openLoginForm(state) {
      state.loginForm = true; // 로그인폼 띄우기
    },
    closeLoginForm(state) {
      state.loginForm = false; // 로그인폼 닫기
    },
  },
});

export const { setloggedIn, openLoginForm, closeLoginForm } =
  loginSlice.actions; // 액션 내보내기
export default loginSlice.reducer; // 리듀서 내보내기
