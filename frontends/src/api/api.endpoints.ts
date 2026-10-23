export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REFRESH_TOKEN: "/users/refresh-token",
  },
  USERS: {
    DASHBOARD: "/users/profile",
    EDIT_PROFILE: "/users/edit-profile",
    CHANGE_AVATAR: "/users/change-avatar",
    CHANGE_COVER_IMAGE: "/users/change-cover-image",
    CHANGE_PASSWORD: "/users/change-password",
    CHANNEL: (userName: string) => `/users/channel/${encodeURIComponent(userName)}`,
  },
  VIDEOS: {
    UPLOAD: "/videos/upload",
    MY_VIDEOS: "/videos/my-videos",
    FEED: "/videos/feed",
    CHANNEL: (userName: string) => `/videos/channel/${encodeURIComponent(userName)}`,
  },
  SUBSCRIPTIONS: {
    TOGGLE: (channelId: string) => `/subscriptions/c/${channelId}`,
    DISCOVER: "/subscriptions/discover",
  },
} as const;

// Endpoints where a 401 means bad credentials, not an expired access token
export const NO_REFRESH_ENDPOINTS: readonly string[] = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
];
