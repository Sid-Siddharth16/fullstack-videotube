export interface User {
  _id: string;
  userName: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: string[];
  subscribersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type EditProfileRequest = Pick<User, "fullName" | "userName" | "email">;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
