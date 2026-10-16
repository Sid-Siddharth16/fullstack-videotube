import type { LoginRequest } from "../../types/auth.types";
import { isBlank, type FieldErrors } from "../../utils/validation.helper";

export interface LoginFormValues {
  identifier: string;
  password: string;
}

export type LoginFormErrors = FieldErrors<LoginFormValues>;

export const LOGIN_INITIAL_VALUES: LoginFormValues = { identifier: "", password: "" };

export const validateLogin = ({ identifier, password }: LoginFormValues): LoginFormErrors => ({
  identifier: isBlank(identifier) ? "Enter your email or username" : undefined,
  password: password ? undefined : "Enter your password",
});

// Backend accepts either email or userName
export const toLoginRequest = ({ identifier, password }: LoginFormValues): LoginRequest => {
  const value = identifier.trim();
  return value.includes("@")
    ? { email: value.toLowerCase(), password }
    : { userName: value.toLowerCase(), password };
};
