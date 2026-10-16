import type { PropsWithChildren } from "react";
import styles from "./Alert.module.css";

interface AlertProps {
  variant?: "error" | "success";
}

export default function Alert({ variant = "error", children }: PropsWithChildren<AlertProps>) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role={variant === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
