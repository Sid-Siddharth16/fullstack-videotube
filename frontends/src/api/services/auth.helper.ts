import type { RegisterRequest } from "../../types/auth.types";

// Field names must match backend multer config: "avatar", "coverImage"
export const toRegisterFormData = ({ avatar, coverImage, ...fields }: RegisterRequest) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  formData.append("avatar", avatar);
  if (coverImage) formData.append("coverImage", coverImage);
  return formData;
};
