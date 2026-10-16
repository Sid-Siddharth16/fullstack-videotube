import type { RegisterRequest } from "../../types/auth.types";
import {
  EMAIL_PATTERN,
  isBlank,
  USERNAME_PATTERN,
  validateImage,
  validatePassword,
  type FieldErrors,
} from "../../utils/validation.helper";

export interface RegisterFormValues {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
  coverImage: File | null;
}

export type RegisterFormErrors = FieldErrors<RegisterFormValues>;

export const REGISTER_INITIAL_VALUES: RegisterFormValues = {
  fullName: "",
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
  avatar: null,
  coverImage: null,
};

export const REGISTER_SUCCESS_NOTICE = "Account created. Please sign in.";

export const validateRegister = (values: RegisterFormValues): RegisterFormErrors => ({
  fullName: isBlank(values.fullName) ? "Enter your full name" : undefined,
  email: EMAIL_PATTERN.test(values.email.trim()) ? undefined : "Enter a valid email address",
  userName: USERNAME_PATTERN.test(values.userName.trim())
    ? undefined
    : "3–30 characters: letters, numbers, dot or underscore",
  password: validatePassword(values.password),
  confirmPassword: values.confirmPassword === values.password ? undefined : "Passwords do not match",
  avatar: validateImage(values.avatar, true),
  coverImage: validateImage(values.coverImage, false),
});

// Call only after validateRegister passes (avatar is guaranteed)
export const toRegisterRequest = (values: RegisterFormValues): RegisterRequest => ({
  fullName: values.fullName.trim(),
  email: values.email.trim().toLowerCase(),
  userName: values.userName.trim().toLowerCase(),
  password: values.password,
  avatar: values.avatar as File,
  coverImage: values.coverImage,
});
