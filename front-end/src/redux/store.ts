import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import resumeReducer from "./resumeSlice";
import themeReducer from "./themeSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const resumePersistConfig = {
  key: "resumeInfo",
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  login: loginReducer, // persist 안 함
  resumeInfo: persistReducer(resumePersistConfig, resumeReducer), // persist 적용
  theme: themeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;