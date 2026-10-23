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

// Another user's channel, as seen by the viewer
export interface ChannelProfile {
  _id: string;
  userName: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  subscribersCount: number;
  subscribedToCount: number;
  isSubscribed: boolean;
}

export type DiscoverChannel = Pick<
  ChannelProfile,
  "_id" | "userName" | "fullName" | "avatar" | "subscribersCount" | "isSubscribed"
>;

export type EditProfileRequest = Pick<User, "fullName" | "userName" | "email">;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
