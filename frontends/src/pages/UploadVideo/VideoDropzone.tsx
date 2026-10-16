import { useId, useState, type DragEvent } from "react";
import { MAX_VIDEO_SIZE_MB } from "../../utils/validation.helper";
import { UploadIcon } from "./icons";
import styles from "./UploadVideo.module.css";

interface VideoDropzoneProps {
  onSelect: (file: File) => void;
  error?: string;
}

// Step 1: empty state shown until a video is picked (click or drag and drop)
export default function VideoDropzone({ onSelect, error }: VideoDropzoneProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // dragleave also fires when moving onto a child element; ignore those
  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onSelect(file);
  };

  return (
    <div className={styles.dropzoneWrap}>
      <label
        htmlFor={inputId}
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${error ? styles.dropzoneInvalid : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className={styles.dropIcon}>
          <UploadIcon />
        </span>
        <span className={styles.dropTitle}>{isDragging ? "Drop to upload" : "Drag and drop a video file"}</span>
        <span className={styles.dropText}>MP4, WebM or MOV · up to {MAX_VIDEO_SIZE_MB} MB</span>
        <span className={styles.dropButton}>Select file</span>
        <input
          id={inputId}
          type="file"
          accept="video/*"
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSelect(file);
            // allow picking the same file again after an error
            event.target.value = "";
          }}
        />
      </label>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
