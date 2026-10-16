import type { UploadVideoRequest } from "../../types/video.types";
import { isBlank, validateImage, validateVideo, type FieldErrors } from "../../utils/validation.helper";

export interface UploadVideoFormValues {
  videoFile: File | null;
  thumbnail: File | null;
  title: string;
  description: string;
  isPublished: boolean;
}

export type UploadVideoFormErrors = FieldErrors<UploadVideoFormValues>;

// Same limits as backend video.validator.js
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 5000;

export const UPLOAD_VIDEO_INITIAL_VALUES: UploadVideoFormValues = {
  videoFile: null,
  thumbnail: null,
  title: "",
  description: "",
  isPublished: true,
};

export const validateUploadVideo = (values: UploadVideoFormValues): UploadVideoFormErrors => ({
  videoFile: validateVideo(values.videoFile),
  thumbnail: values.thumbnail ? validateImage(values.thumbnail, true) : "Add a thumbnail or use a frame from the video",
  title: isBlank(values.title) ? "Give your video a title" : undefined,
  description: isBlank(values.description) ? "Add a short description" : undefined,
});

// Call only after validateUploadVideo passes (both files are guaranteed)
export const toUploadVideoRequest = (values: UploadVideoFormValues): UploadVideoRequest => ({
  videoFile: values.videoFile as File,
  thumbnail: values.thumbnail as File,
  title: values.title.trim(),
  description: values.description.trim(),
  isPublished: values.isPublished,
});

// "my_trip-2024.mp4" → "my trip 2024"
export const titleFromFileName = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, TITLE_MAX_LENGTH);

const isFieldError = (item: unknown): item is { field: string; message: string } =>
  Boolean(item) &&
  typeof item === "object" &&
  typeof (item as { field?: unknown }).field === "string" &&
  typeof (item as { message?: unknown }).message === "string";

// Backend validate middleware replies with errors: [{ field, message }]
export const toServerFieldErrors = (errors: unknown[]): UploadVideoFormErrors =>
  errors.filter(isFieldError).reduce<UploadVideoFormErrors>((acc, { field, message }) => {
    if (field in UPLOAD_VIDEO_INITIAL_VALUES) acc[field as keyof UploadVideoFormValues] ??= message;
    return acc;
  }, {});

// Grabs the frame the <video> is currently showing as a JPEG thumbnail
export const captureVideoFrame = (video: HTMLVideoElement): Promise<File | null> => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context || !canvas.width || !canvas.height) return Promise.resolve(null);

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ? new File([blob], "thumbnail.jpg", { type: "image/jpeg" }) : null),
      "image/jpeg",
      0.9,
    );
  });
};
