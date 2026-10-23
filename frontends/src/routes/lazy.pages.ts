import { lazy } from "react";

// Code-split per page; rendered inside layout <Suspense> boundaries
export const LoginPage = lazy(() => import("../pages/Login"));
export const RegisterPage = lazy(() => import("../pages/Register"));
export const HomePage = lazy(() => import("../pages/Home"));
export const DashboardPage = lazy(() => import("../pages/Dashboard"));
export const EditProfilePage = lazy(() => import("../pages/EditProfile"));
export const MyVideosPage = lazy(() => import("../pages/MyVideos"));
export const UploadVideoPage = lazy(() => import("../pages/UploadVideo"));
export const ComingSoonPage = lazy(() => import("../pages/ComingSoon"));
export const ChannelPage = lazy(() => import("../pages/Channel"));
export const ChangePasswordPage = lazy(() => import("../pages/Change-Password"));