import type { User } from "./user.types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession extends AuthTokens {
  user: User;
}

export type LoginRequest =
  | { email: string; userName?: never; password: string }
  | { userName: string; email?: never; password: string };

export type LoginResponse = AuthSession;

export interface RegisterRequest {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  avatar: File;
  coverImage?: File | null;
}
