export const STORAGE_KEYS = {
  ACCESS_TOKEN: "vt_access_token",
  REFRESH_TOKEN: "vt_refresh_token",
  USER: "vt_user",
} as const;

export const AUTH_EVENTS = {
  SESSION_EXPIRED: "auth:session-expired",
} as const;
