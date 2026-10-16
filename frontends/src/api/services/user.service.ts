import { ENV } from "../../config/env.config";
import type { ApiResponse } from "../../types/api.types";
import type { ChangePasswordRequest, EditProfileRequest, User } from "../../types/user.types";
import { API_ENDPOINTS } from "../api.endpoints";
import axiosInstance from "../axios.instance";

export const userService = {
  async getHome(signal?: AbortSignal) {
    const { data } = await axiosInstance.get<ApiResponse<string>>(API_ENDPOINTS.USERS.HOME, { signal });
    return data.data;
  },

  async getDashboard() {
    const { data } = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.USERS.DASHBOARD);
    return data.data;
  },

  async editProfile(payload: EditProfileRequest) {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(API_ENDPOINTS.USERS.EDIT_PROFILE, payload);
    return data.data;
  },

  // Field names must match backend multer config: upload.single("avatar") / upload.single("coverImage")
  async changeAvatar(file: File) {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.CHANGE_AVATAR,
      toImageFormData("avatar", file),
      { timeout: ENV.UPLOAD_TIMEOUT_MS },
    );
    return data.data;
  },

  async changeCoverImage(file: File) {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.CHANGE_COVER_IMAGE,
      toImageFormData("coverImage", file),
      { timeout: ENV.UPLOAD_TIMEOUT_MS },
    );
    return data.data;
  },

  async changePassword(payload: ChangePasswordRequest) {
    await axiosInstance.patch<ApiResponse<Record<string, never>>>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, payload);
  },
};

const toImageFormData = (field: string, file: File) => {
  const formData = new FormData();
  formData.append(field, file);
  return formData;
};
