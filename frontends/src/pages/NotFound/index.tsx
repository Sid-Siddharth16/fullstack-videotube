import { Link } from "react-router";
import { ROUTES } from "../../constants/route.constant";
import styles from "./NotFound.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you're looking for doesn't exist or was moved.</p>
      <Link to={ROUTES.Home} className={styles.link}>
        Go back home
      </Link>
    </main>
  );
}
