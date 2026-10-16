import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./InputField.module.css";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
}

export default function InputField({ label, error, hint, endAdornment, id, className = "", ...rest }: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.control} ${error ? styles.invalid : ""}`}>
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {endAdornment}
      </div>
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  );
}
