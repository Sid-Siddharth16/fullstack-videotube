import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env.config";
import { HTTP_STATUS } from "../constants/http.constant";
import { AUTH_EVENTS } from "../constants/storage.constant";
import type { ApiResponse } from "../types/api.types";
import type { AuthTokens } from "../types/auth.types";
import { authStorage } from "../utils/storage.helper";
import { API_ENDPOINTS, NO_REFRESH_ENDPOINTS } from "./api.endpoints";
import { toHttpError } from "./api.helper";

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Shared across concurrent 401s so only one refresh request is sent
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token");

  // Bare axios: bypasses these interceptors to avoid a refresh loop
  const { data } = await axios.post<ApiResponse<AuthTokens>>(
    `${ENV.API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
    { refreshToken },
    { withCredentials: true, timeout: ENV.API_TIMEOUT_MS },
  );

  authStorage.setTokens(data.data);
  return data.data.accessToken;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined;
    const shouldRefresh =
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      request &&
      !request._retry &&
      !NO_REFRESH_ENDPOINTS.includes(request.url ?? "");

    if (!shouldRefresh) return Promise.reject(toHttpError(error));

    request._retry = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(request);
    } catch (refreshError) {
      authStorage.clear();
      window.dispatchEvent(new Event(AUTH_EVENTS.SESSION_EXPIRED));
      return Promise.reject(toHttpError(refreshError));
    }
  },
);

export default axiosInstance;
