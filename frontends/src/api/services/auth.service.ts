import { ENV } from "../../config/env.config";
import type { ApiResponse } from "../../types/api.types";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../../types/auth.types";
import type { User } from "../../types/user.types";
import { API_ENDPOINTS } from "../api.endpoints";
import axiosInstance from "../axios.instance";
import { toRegisterFormData } from "./auth.helper";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data.data;
  },

  async register(payload: RegisterRequest) {
    const { data } = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.REGISTER,
      toRegisterFormData(payload),
      { timeout: ENV.UPLOAD_TIMEOUT_MS },
    );
    return data.data;
  },

  async logout() {
    await axiosInstance.post<ApiResponse<Record<string, never>>>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
