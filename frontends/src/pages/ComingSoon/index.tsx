import { Link } from "react-router";
import { ROUTES } from "../../constants/route.constant";
import styles from "./ComingSoon.module.css";

// Placeholder for menu destinations that don't have a real page yet
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>This page is coming soon.</p>
      <Link to={ROUTES.Home} className={styles.link}>
        Back to home
      </Link>
    </section>
  );
}
