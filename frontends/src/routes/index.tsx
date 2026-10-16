import { createBrowserRouter } from "react-router";
import { ROUTES } from "../constants/route.constant";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/NotFound";
import {
  ChangePasswordPage,
  ComingSoonPage,
  DashboardPage,
  EditProfilePage,
  HomePage,
  LoginPage,
  MyVideosPage,
  RegisterPage,
  UploadVideoPage,
} from "./lazy.pages";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.Home, element: <HomePage /> },
          { path: ROUTES.PROFILE, element: <DashboardPage /> },
          { path: ROUTES.EDIT_PROFILE, element: <EditProfilePage /> },
          { path: ROUTES.MY_VIDEOS, element: <MyVideosPage /> },
          { path: ROUTES.SETTINGS, element: <ComingSoonPage title="Settings" /> },
          { path: ROUTES.CREATE, element: <UploadVideoPage /> },
          { path: ROUTES.SHORTS, element: <ComingSoonPage title="Shorts" /> },
          { path: ROUTES.SUBSCRIPTIONS, element: <ComingSoonPage title="Subscriptions" /> },
          { path: ROUTES.HISTORY, element: <ComingSoonPage title="History" /> },
          { path: ROUTES.PLAYLISTS, element: <ComingSoonPage title="Playlists" /> },
          { path: ROUTES.WATCH_LATER, element: <ComingSoonPage title="Watch later" /> },
          { path: ROUTES.LIKED_VIDEOS, element: <ComingSoonPage title="Liked videos" /> },
          { path : ROUTES.CHANGE_PASSWORD, element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
