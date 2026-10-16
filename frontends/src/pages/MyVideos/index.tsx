import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../api/api.helper";
import { videoService } from "../../api/services/video.service";
import { PlusIcon, VideoIcon } from "../../components/ProfileMenu/icons";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/route.constant";
import type { Video } from "../../types/video.types";
import { formatCount } from "../../utils/format.helper";
import {
  countByFilter,
  EMPTY_FILTER_TEXT,
  getTotalViews,
  matchesFilter,
  SKELETON_COUNT,
  VIDEO_FILTERS,
  type VideoFilter,
} from "./myVideos.helper";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";
import VideoPlayerDialog from "./VideoPlayerDialog";
import styles from "./MyVideos.module.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; videos: Video[] };

export default function MyVideosPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [filter, setFilter] = useState<VideoFilter>("all");
  const [playing, setPlaying] = useState<Video | null>(null);
  // Bumped by "Try again" to re-run the fetch effect
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    videoService
      .getMyVideos(controller.signal)
      .then((videos) => setState({ status: "ready", videos }))
      .catch((err) => {
        if (!controller.signal.aborted) setState({ status: "error", message: getErrorMessage(err) });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  const videos = state.status === "ready" ? state.videos : [];
  const counts = countByFilter(videos);
  const visibleVideos = videos.filter((video) => matchesFilter(video, filter));
  const totalViews = getTotalViews(videos);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your videos</h1>
          <p className={styles.subtitle}>
            {state.status === "ready" && videos.length > 0
              ? `${counts.all} ${counts.all === 1 ? "video" : "videos"} · ${formatCount(totalViews)} total views`
              : "Everything you've uploaded, in one place."}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE)}>
          <PlusIcon />
          Upload video
        </Button>
      </header>

      {state.status === "error" && (
        <div className={styles.errorBox}>
          <Alert>{state.message}</Alert>
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {state.status === "loading" && (
        <div className={styles.grid} aria-busy="true" aria-label="Loading your videos">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {state.status === "ready" && videos.length === 0 && (
        <section className={styles.empty}>
          <span className={styles.emptyIcon}>
            <VideoIcon />
          </span>
          <h2 className={styles.emptyTitle}>No videos yet</h2>
          <p className={styles.subtitle}>Upload your first video and it will show up here.</p>
          <Button onClick={() => navigate(ROUTES.CREATE)}>Upload your first video</Button>
        </section>
      )}

      {state.status === "ready" && videos.length > 0 && (
        <>
          <div className={styles.filters} role="group" aria-label="Filter videos">
            {VIDEO_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`${styles.chip} ${filter === value ? styles.chipActive : ""}`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
                <span className={styles.chipCount}>{counts[value]}</span>
              </button>
            ))}
          </div>

          {visibleVideos.length > 0 ? (
            <div className={styles.grid}>
              {visibleVideos.map((video) => (
                <VideoCard key={video._id} video={video} onPlay={setPlaying} />
              ))}
            </div>
          ) : (
            <p className={styles.filterEmpty}>{filter !== "all" && EMPTY_FILTER_TEXT[filter]}</p>
          )}
        </>
      )}

      <VideoPlayerDialog video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
