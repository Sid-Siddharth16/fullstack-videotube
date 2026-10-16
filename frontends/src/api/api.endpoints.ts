export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REFRESH_TOKEN: "/users/refresh-token",
  },
  USERS: {
    HOME: "/users/home",
    DASHBOARD: "/users/profile",
    EDIT_PROFILE: "/users/edit-profile",
    CHANGE_AVATAR: "/users/change-avatar",
    CHANGE_COVER_IMAGE: "/users/change-cover-image",
    CHANGE_PASSWORD: "/users/change-password",
  },
  VIDEOS: {
    UPLOAD: "/users/upload-video",
    MY_VIDEOS: "/users/my-videos",
  },
} as const;

// Endpoints where a 401 means bad credentials, not an expired access token
export const NO_REFRESH_ENDPOINTS: readonly string[] = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
];
