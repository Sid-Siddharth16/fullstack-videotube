import type { Video } from "../../types/video.types";

export type VideoFilter = "all" | "public" | "draft";

export const VIDEO_FILTERS: { value: VideoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "draft", label: "Drafts" },
];

export const EMPTY_FILTER_TEXT: Record<Exclude<VideoFilter, "all">, string> = {
  public: "You have no public videos yet.",
  draft: "You have no drafts.",
};

export const SKELETON_COUNT = 8;

export const matchesFilter = (video: Video, filter: VideoFilter) =>
  filter === "all" || (filter === "public" ? video.isPublished : !video.isPublished);

export const countByFilter = (videos: Video[]): Record<VideoFilter, number> => {
  const published = videos.filter((video) => video.isPublished).length;
  return { all: videos.length, public: published, draft: videos.length - published };
};

export const getTotalViews = (videos: Video[]) => videos.reduce((sum, video) => sum + video.views, 0);
