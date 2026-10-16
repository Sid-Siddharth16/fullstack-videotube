import type { Video } from "../../types/video.types";
import { formatCount } from "../../utils/format.helper";

export type ChannelTab = "home" | "videos" | "posts";

export const CHANNEL_TABS: { value: ChannelTab; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "videos", label: "Videos" },
  { value: "posts", label: "Posts" },
];

export const EMPTY_TAB_TEXT: Record<Exclude<ChannelTab, "home" | "videos">, string> = {
  posts: "This channel hasn't posted yet.",
};

// Videos shown on the Home tab's "For you" shelf
export const HOME_SHELF_SIZE = 6;

export const SKELETON_COUNT = 6;

const pluralize = (count: number, word: string) => `${formatCount(count)} ${count === 1 ? word : `${word}s`}`;

// "1.5K subscribers • 148 videos"
export const getChannelMeta = (subscribers: number, videoCount: number | null) =>
  [pluralize(subscribers, "subscriber"), videoCount !== null && pluralize(videoCount, "video")]
    .filter(Boolean)
    .join(" • ");

// Viewers see the public channel, so drafts are hidden; newest first
export const getChannelVideos = (videos: Video[]) =>
  videos
    .filter((video) => video.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const matchesQuery = (video: Video, query: string) =>
  video.title.toLowerCase().includes(query.trim().toLowerCase());
