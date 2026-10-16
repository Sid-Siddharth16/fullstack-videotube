import { useId, type ChangeEvent } from "react";
import { useObjectUrl } from "../../../hooks/useObjectUrl";
import styles from "./FileField.module.css";

interface FileFieldProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  hint?: string;
  shape?: "circle" | "banner";
}

export default function FileField({
  label,
  file,
  onFileChange,
  accept = "image/*",
  error,
  hint,
  shape = "circle",
}: FileFieldProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  const previewUrl = useObjectUrl(file);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <label htmlFor={inputId} className={`${styles.dropzone} ${error ? styles.invalid : ""}`}>
        <span className={`${styles.preview} ${styles[shape]}`}>
          {previewUrl ? <img src={previewUrl} alt="" /> : <span aria-hidden="true">＋</span>}
        </span>
        <span className={styles.meta}>
          <span className={styles.fileName}>{file ? file.name : "Choose an image"}</span>
          <span className={styles.action}>{file ? "Change" : "Browse"}</span>
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
        />
      </label>
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  );
}
