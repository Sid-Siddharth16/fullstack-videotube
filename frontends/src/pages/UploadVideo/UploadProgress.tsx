import { formatBytes } from "../../utils/format.helper";
import styles from "./UploadVideo.module.css";

interface UploadProgressProps {
  progress: number;
  totalBytes: number;
}

// 100% means the browser has sent everything; the server is still pushing to Cloudinary
export default function UploadProgress({ progress, totalBytes }: UploadProgressProps) {
  const isProcessing = progress >= 100;

  return (
    <div className={styles.progress}>
      <div className={styles.progressText} role="status" aria-live="polite">
        <span className={styles.progressLabel}>
          {isProcessing ? "Processing your video… this can take a minute" : `Uploading… ${progress}%`}
        </span>
        {!isProcessing && (
          <span className={styles.progressBytes}>
            {formatBytes((totalBytes * progress) / 100)} of {formatBytes(totalBytes)}
          </span>
        )}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Upload progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isProcessing ? undefined : progress}
      >
        <div
          className={`${styles.bar} ${isProcessing ? styles.barIndeterminate : ""}`}
          style={isProcessing ? undefined : { width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
