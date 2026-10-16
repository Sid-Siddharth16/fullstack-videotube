import { useState } from "react";
import InputField, { type InputFieldProps } from "../InputField";
import styles from "./PasswordField.module.css";

type PasswordFieldProps = Omit<InputFieldProps, "type" | "endAdornment">;

export default function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      {...props}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}
