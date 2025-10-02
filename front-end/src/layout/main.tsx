import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CommunityLayout } from "../components/community/CommunityLayout.tsx";
import { MainBodyPage } from "../page/MainBodyPage.tsx";
import { UserPage } from "../page/UserPage.tsx";
import { CommunityListPage } from "../page/community/CommunityListPage.tsx";
import { ReadPostPage } from "../page/community/ReadPostPage.tsx";
import { WritePostPage } from "../page/community/WritePostPage.tsx";
import { InquiryFormPage } from "../page/inquiry/InquiryFormPage.tsx";
import { InquiryPage } from "../page/inquiry/InquiryPage.tsx";
import { EditResumePage } from "../page/resume/EditResumePage.tsx";
import { GitConnectPage } from "../page/resume/GitConnectPage.tsx";
import { ResumeIntroPage } from "../page/resume/ResumeIntroPage.tsx";
import { ResumeListPage } from "../page/resume/ResumeListPage.tsx";
import { store, persistor } from "../redux/store.ts";
import App from "./App.tsx";
import { ResumeSetupLayout } from "./resume/ResumeSetupLayout .tsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "users",
        element: <UserPage />,
      },
      {
        index: true,
        element: <MainBodyPage />,
      },
      {
        path: "inquiry",
        element: <InquiryPage />,
      },
      {
        path: "inquiry/new",
        element: <InquiryFormPage />,
      },
      {
        path: "community",
        element: <CommunityLayout />,
        children: [
          {
            path: ":categoryKey",
            element: <CommunityListPage />,
          },
          {
            path: "post/:postId",
            element: <ReadPostPage />,
          },
        ],
      },
      {
        path: "post/new",
        element: <WritePostPage />, // 글 작성
      },
      {
        path: "post/:postId/edit",
        element: <WritePostPage />, // 글 수정
      },
    ],
  },
  {
    path: "/resume",
    element: <ResumeSetupLayout />,
    children: [
      {
        index: true,
        element: <ResumeIntroPage />,
      },
      {
        path: "list",
        element: <ResumeListPage />,
      },
      { path: "connect", element: <GitConnectPage /> },
    ],
  },
  {
    path: "/resume/:id/editor",
    element: <EditResumePage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
