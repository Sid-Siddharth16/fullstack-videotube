import { useId, type TextareaHTMLAttributes } from "react";
import styles from "./TextAreaField.module.css";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  value: string;
}

// Shows a live "used / max" counter whenever maxLength is set
export default function TextAreaField({
  label,
  error,
  hint,
  id,
  maxLength,
  value,
  className = "",
  rows = 5,
  ...rest
}: TextAreaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  const nearLimit = maxLength !== undefined && value.length >= maxLength * 0.9;

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={`${styles.textarea} ${error ? styles.invalid : ""}`}
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {(message || maxLength !== undefined) && (
        <div className={styles.footer}>
          {message ? (
            <p id={messageId} className={error ? styles.error : styles.hint}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {maxLength !== undefined && (
            <span className={`${styles.counter} ${nearLimit ? styles.counterWarn : ""}`} aria-hidden="true">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
