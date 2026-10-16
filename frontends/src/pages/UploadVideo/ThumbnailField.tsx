import { useId } from "react";
import Button from "../../components/ui/Button";
import { useObjectUrl } from "../../hooks/useObjectUrl";
import { MAX_IMAGE_SIZE_MB } from "../../utils/validation.helper";
import { ImageIcon } from "./icons";
import styles from "./UploadVideo.module.css";

interface ThumbnailFieldProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onCaptureFrame: () => void;
  canCapture: boolean;
  isCapturing: boolean;
  error?: string;
}

export default function ThumbnailField({
  file,
  onFileChange,
  onCaptureFrame,
  canCapture,
  isCapturing,
  error,
}: ThumbnailFieldProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const previewUrl = useObjectUrl(file);

  return (
    <div className={styles.thumbField}>
      <span className={styles.sectionLabel}>Thumbnail</span>

      <label htmlFor={inputId} className={`${styles.thumbBox} ${error ? styles.thumbInvalid : ""}`}>
        {previewUrl ? (
          <img src={previewUrl} alt="Selected thumbnail" />
        ) : (
          <span className={styles.thumbEmpty}>
            <ImageIcon />
            <span>Upload a thumbnail</span>
          </span>
        )}
      </label>

      <div className={styles.thumbActions}>
        <label className={styles.fileButton}>
          {file ? "Change image" : "Upload image"}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-invalid={Boolean(error)}
            aria-describedby={messageId}
            onChange={(event) => {
              const next = event.target.files?.[0];
              if (next) onFileChange(next);
              event.target.value = "";
            }}
          />
        </label>
        <Button variant="ghost" onClick={onCaptureFrame} disabled={!canCapture} isLoading={isCapturing}>
          Use current frame
        </Button>
      </div>

      <p id={messageId} className={error ? styles.error : styles.hint}>
        {error ??
          (canCapture
            ? `Pause the video on any frame and click "Use current frame", or upload an image (max ${MAX_IMAGE_SIZE_MB} MB).`
            : `JPG or PNG, 16:9 works best · max ${MAX_IMAGE_SIZE_MB} MB.`)}
      </p>
    </div>
  );
}
