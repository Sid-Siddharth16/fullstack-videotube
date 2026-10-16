export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 0 = request never reached the server (offline, CORS, timeout)
export const NETWORK_ERROR_STATUS = 0;

export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  [NETWORK_ERROR_STATUS]: "Unable to reach the server. Check your connection and try again.",
  [HTTP_STATUS.BAD_REQUEST]: "Some details are invalid. Please review and try again.",
  [HTTP_STATUS.UNAUTHORIZED]: "Invalid credentials or your session has expired.",
  [HTTP_STATUS.FORBIDDEN]: "You don't have permission to do that.",
  [HTTP_STATUS.NOT_FOUND]: "The requested resource was not found.",
  [HTTP_STATUS.CONFLICT]: "This record already exists.",
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: "Some details are invalid. Please review and try again.",
  [HTTP_STATUS.TOO_MANY_REQUESTS]: "Too many attempts. Please wait a moment.",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Something went wrong on our side. Please try again.",
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable.",
};

export const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
