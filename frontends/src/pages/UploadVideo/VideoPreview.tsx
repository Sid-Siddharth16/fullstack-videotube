import { useState, type RefObject } from "react";
import { useObjectUrl } from "../../hooks/useObjectUrl";
import { formatBytes, formatDuration } from "../../utils/format.helper";
import styles from "./UploadVideo.module.css";

interface VideoPreviewProps {
  file: File;
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number | null;
  onReady: (duration: number) => void;
  onReplace: (file: File) => void;
  error?: string;
}

export default function VideoPreview({ file, videoRef, duration, onReady, onReplace, error }: VideoPreviewProps) {
  const url = useObjectUrl(file);
  // Tracked per URL so picking another file clears the failure without an effect
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const previewFailed = url !== null && failedUrl === url;

  return (
    <div className={styles.previewCard}>
      <div className={styles.player}>
        {previewFailed ? (
          <p className={styles.playerFallback}>
            Your browser can't preview this format, but it can still be uploaded.
          </p>
        ) : (
          url && (
            <video
              ref={videoRef}
              src={url}
              controls
              playsInline
              preload="metadata"
              onLoadedData={(event) => onReady(event.currentTarget.duration)}
              onError={() => setFailedUrl(url)}
            />
          )
        )}
      </div>

      <div className={styles.previewMeta}>
        <div className={styles.previewInfo}>
          <span className={styles.previewName} title={file.name}>
            {file.name}
          </span>
          <span className={styles.previewDetails}>
            {formatBytes(file.size)}
            {duration !== null && ` · ${formatDuration(duration)}`}
          </span>
        </div>
        <label className={styles.fileButton}>
          Replace
          <input
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(event) => {
              const next = event.target.files?.[0];
              if (next) onReplace(next);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
