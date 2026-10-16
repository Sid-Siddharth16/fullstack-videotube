import Spinner from "../Spinner";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className={styles.wrapper}>
      <Spinner size={32} label="Loading page" />
    </div>
  );
}
