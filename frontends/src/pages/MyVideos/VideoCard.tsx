import type { Video } from "../../types/video.types";
import { formatCount, formatDuration, formatRelativeTime } from "../../utils/format.helper";
import styles from "./MyVideos.module.css";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <article className={styles.cardItem}>
      <button
        type="button"
        className={styles.thumbButton}
        onClick={() => onPlay(video)}
        aria-label={`Play ${video.title}`}
      >
        <img src={video.thumbnail} alt="" loading="lazy" />
        <span className={styles.playOverlay} aria-hidden="true">
          ▶
        </span>
        {!video.isPublished && <span className={styles.draftBadge}>Draft</span>}
        <span className={styles.durationBadge}>{formatDuration(video.duration)}</span>
      </button>
      <h2 className={styles.cardTitle} title={video.title}>
        {video.title}
      </h2>
      <p className={styles.cardMeta}>
        {formatCount(video.views)} {video.views === 1 ? "view" : "views"} ·{" "}
        <time dateTime={video.createdAt}>{formatRelativeTime(video.createdAt)}</time>
      </p>
    </article>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className={styles.cardItem} aria-hidden="true">
      <div className={`${styles.skeleton} ${styles.skeletonThumb}`} />
      <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
      <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
    </div>
  );
}
