import type { ChangePasswordRequest } from "../../types/user.types";
import { validatePassword, type FieldErrors } from "../../utils/validation.helper";

export interface ChangePasswordFormValues extends ChangePasswordRequest {
  confirmPassword: string;
}

export type ChangePasswordFormErrors = FieldErrors<ChangePasswordFormValues>;

export const CHANGE_PASSWORD_INITIAL_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const CHANGE_PASSWORD_SUCCESS_MESSAGE = "Password changed successfully.";

export const validateChangePassword = (values: ChangePasswordFormValues): ChangePasswordFormErrors => ({
  currentPassword: values.currentPassword ? undefined : "Enter your current password",
  newPassword:
    validatePassword(values.newPassword) ??
    (values.newPassword === values.currentPassword ? "New password must be different from the current one" : undefined),
  confirmPassword: values.confirmPassword === values.newPassword ? undefined : "Passwords do not match",
});

export const toChangePasswordRequest = ({ currentPassword, newPassword }: ChangePasswordFormValues): ChangePasswordRequest => ({
  currentPassword,
  newPassword,
});
