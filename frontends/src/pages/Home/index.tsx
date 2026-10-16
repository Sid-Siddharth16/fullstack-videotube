import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/api.helper";
import { userService } from "../../api/services/user.service";
import Alert from "../../components/ui/Alert";
import PageLoader from "../../components/ui/PageLoader";
import styles from "./Home.module.css";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    userService
      .getHome(controller.signal)
      .then(setMessage)
      .catch((err) => {
        if (!controller.signal.aborted) setError(getErrorMessage(err));
      });
    return () => controller.abort();
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!message) return <PageLoader />;

  return (
    <div className={styles.page}>
      <h1 className={styles.message}>{message}</h1>
    </div>
  );
}
