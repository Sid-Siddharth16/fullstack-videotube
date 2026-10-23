import { Link } from "react-router";
import { channelPath } from "../../constants/route.constant";
import type { Video, VideoOwner } from "../../types/video.types";
import { formatCount, formatDuration, formatRelativeTime } from "../../utils/format.helper";
import styles from "./MyVideos.module.css";

// Generic so feed videos (populated owner) and own videos (owner id) both fit
interface VideoCardProps<T extends Omit<Video, "owner">> {
  video: T;
  onPlay: (video: T) => void;
  // Set on feeds that mix channels; links the card to its channel page
  owner?: VideoOwner;
}

export default function VideoCard<T extends Omit<Video, "owner">>({ video, onPlay, owner }: VideoCardProps<T>) {
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
      {owner && (
        <Link to={channelPath(owner.userName)} className={styles.cardOwner}>
          {owner.fullName}
        </Link>
      )}
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
