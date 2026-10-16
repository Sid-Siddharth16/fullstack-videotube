import { ENV } from "../../config/env.config";
import type { ApiResponse } from "../../types/api.types";
import type { UploadVideoRequest, Video } from "../../types/video.types";
import { API_ENDPOINTS } from "../api.endpoints";
import axiosInstance from "../axios.instance";

interface UploadOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

// Field names must match backend multer config: "videoFile", "thumbnail"
const toUploadVideoFormData = ({ videoFile, thumbnail, title, description, isPublished }: UploadVideoRequest) => {
  const formData = new FormData();
  // Text fields first so they are already in req.body while multer reads the files
  formData.append("title", title);
  formData.append("description", description);
  formData.append("isPublished", String(isPublished));
  formData.append("videoFile", videoFile);
  formData.append("thumbnail", thumbnail);
  return formData;
};

export const videoService = {
  async upload(payload: UploadVideoRequest, { onProgress, signal }: UploadOptions = {}) {
    const { data } = await axiosInstance.post<ApiResponse<Video>>(
      API_ENDPOINTS.VIDEOS.UPLOAD,
      toUploadVideoFormData(payload),
      {
        timeout: ENV.VIDEO_UPLOAD_TIMEOUT_MS,
        signal,
        onUploadProgress: ({ loaded, total }) => {
          if (total) onProgress?.(Math.min(100, Math.round((loaded / total) * 100)));
        },
      },
    );
    return data.data;
  },

  async getMyVideos(signal?: AbortSignal) {
    const { data } = await axiosInstance.get<ApiResponse<Video[]>>(API_ENDPOINTS.VIDEOS.MY_VIDEOS, { signal });
    return data.data;
  },
};
