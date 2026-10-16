import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
  label?: string;
}

export default function Spinner({ size = 18, label = "Loading" }: SpinnerProps) {
  return (
    <span className={styles.spinner} style={{ width: size, height: size }} role="status">
      <span className="sr-only">{label}</span>
    </span>
  );
}
