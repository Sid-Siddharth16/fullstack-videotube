// Mirrors backend Video model
export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  likes: number;
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Owner fields populated by the feed endpoint
export interface VideoOwner {
  _id: string;
  userName: string;
  fullName: string;
  avatar: string;
}

export type FeedVideo = Omit<Video, "owner"> & { owner: VideoOwner };

export interface UploadVideoRequest {
  videoFile: File;
  thumbnail: File;
  title: string;
  description: string;
  isPublished: boolean;
}
