import { Suspense } from "react";
import { Outlet } from "react-router";
import PageLoader from "../../components/ui/PageLoader";
import { APP_NAME, APP_TAGLINE } from "../../constants/app.constant";
import styles from "./AuthLayout.module.css";

export default function AuthLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.brandPanel}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="" className={styles.logo} />
          <span>{APP_NAME}</span>
        </div>
        <div className={styles.pitch}>
          <h2>Your videos, your audience.</h2>
          <p>{APP_TAGLINE}</p>
        </div>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </aside>

      <main className={styles.content}>
        <div className={styles.contentInner}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
