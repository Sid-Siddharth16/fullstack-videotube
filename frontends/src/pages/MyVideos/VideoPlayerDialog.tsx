import { useEffect, useRef } from "react";
import type { Video } from "../../types/video.types";
import { formatCount, formatDate } from "../../utils/format.helper";
import styles from "./MyVideos.module.css";

interface VideoPlayerDialogProps {
  video: Video | null;
  onClose: () => void;
}

// Native <dialog>: focus trap, Esc to close and inert background come for free
export default function VideoPlayerDialog({ video, onClose }: VideoPlayerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
  }, [video]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="player-title"
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a backdrop click
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Content unmounts on close, which also stops playback */}
      {video && (
        <div className={styles.dialogBody}>
          <div className={styles.dialogPlayer}>
            <video src={video.videoFile} poster={video.thumbnail} controls autoPlay playsInline />
          </div>
          <div className={styles.dialogInfo}>
            <div className={styles.dialogHeader}>
              <h2 id="player-title" className={styles.dialogTitle}>
                {video.title}
              </h2>
              <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close player">
                ✕
              </button>
            </div>
            <p className={styles.cardMeta}>
              {video.isPublished ? "Public" : "Draft"} · {formatCount(video.views)} views ·{" "}
              {formatCount(video.likes)} likes · Uploaded {formatDate(video.createdAt)}
            </p>
            <p className={styles.dialogDescription}>{video.description}</p>
          </div>
        </div>
      )}
    </dialog>
  );
}
