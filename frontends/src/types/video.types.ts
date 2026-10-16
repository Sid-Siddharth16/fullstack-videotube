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

export interface UploadVideoRequest {
  videoFile: File;
  thumbnail: File;
  title: string;
  description: string;
  isPublished: boolean;
}
