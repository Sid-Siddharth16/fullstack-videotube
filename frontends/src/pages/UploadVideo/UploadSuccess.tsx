import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/route.constant";
import type { Video } from "../../types/video.types";
import { formatDuration } from "../../utils/format.helper";
import { CheckIcon } from "./icons";
import styles from "./UploadVideo.module.css";

interface UploadSuccessProps {
  video: Video;
  onUploadAnother: () => void;
}

export default function UploadSuccess({ video, onUploadAnother }: UploadSuccessProps) {
  const navigate = useNavigate();

  return (
    <section className={`${styles.card} ${styles.success}`} aria-labelledby="upload-success-title">
      <span className={styles.successIcon}>
        <CheckIcon />
      </span>
      <h1 id="upload-success-title" className={styles.title}>
        Video uploaded
      </h1>
      <p className={styles.subtitle}>
        {video.isPublished ? "Your video is now live." : "Saved as a draft. Only you can see it."}
      </p>

      <figure className={styles.successPreview}>
        <div className={styles.successThumb}>
          <img src={video.thumbnail} alt="" />
          <span className={styles.durationBadge}>{formatDuration(video.duration)}</span>
        </div>
        <figcaption className={styles.successTitle}>{video.title}</figcaption>
      </figure>

      <div className={styles.successActions}>
        <Button variant="secondary" onClick={onUploadAnother}>
          Upload another
        </Button>
        <Button onClick={() => navigate(ROUTES.MY_VIDEOS)}>Go to your videos</Button>
      </div>
    </section>
  );
}
