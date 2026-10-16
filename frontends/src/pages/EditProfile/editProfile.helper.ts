import type { EditProfileRequest, User } from "../../types/user.types";
import { EMAIL_PATTERN, isBlank, USERNAME_PATTERN, type FieldErrors } from "../../utils/validation.helper";

export type EditProfileFormValues = EditProfileRequest;

export type EditProfileFormErrors = FieldErrors<EditProfileFormValues>;

export const EDIT_PROFILE_SUCCESS_MESSAGE = "Profile updated successfully.";

export const toEditProfileValues = (user: User): EditProfileFormValues => ({
  fullName: user.fullName,
  userName: user.userName,
  email: user.email,
});

export const validateEditProfile = (values: EditProfileFormValues): EditProfileFormErrors => ({
  fullName: isBlank(values.fullName) ? "Enter your full name" : undefined,
  email: EMAIL_PATTERN.test(values.email.trim()) ? undefined : "Enter a valid email address",
  userName: USERNAME_PATTERN.test(values.userName.trim())
    ? undefined
    : "3–30 characters: letters, numbers, dot or underscore",
});

// Normalised the same way the backend stores these fields
export const toEditProfileRequest = (values: EditProfileFormValues): EditProfileRequest => ({
  fullName: values.fullName.trim(),
  userName: values.userName.trim().toLowerCase(),
  email: values.email.trim().toLowerCase(),
});

export const isProfileUnchanged = (values: EditProfileFormValues, user: User) => {
  const next = toEditProfileRequest(values);
  return next.fullName === user.fullName && next.userName === user.userName && next.email === user.email;
};
