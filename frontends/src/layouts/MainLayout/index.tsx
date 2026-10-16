import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import PageLoader from "../../components/ui/PageLoader";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import styles from "./MainLayout.module.css";

// Wide screens dock the sidebar and toggle full <-> mini; narrower ones open it as an overlay drawer
const DOCKED_QUERY = "(min-width: 1200px)";

export default function MainLayout() {
  const isDocked = useMediaQuery(DOCKED_QUERY);
  const { pathname } = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  // Path the drawer was opened on, so it closes itself on navigation or when the layout docks
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const isDrawerOpen = !isDocked && drawerPath === pathname;

  const closeDrawer = () => setDrawerPath(null);

  const handleMenuClick = () => {
    if (isDocked) setIsExpanded((prev) => !prev);
    else setDrawerPath(isDrawerOpen ? null : pathname);
  };

  // Escape closes the drawer
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerPath(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <div className={styles.layout}>
      <Navbar onMenuClick={handleMenuClick} />
      <div className={styles.body}>
        <div className={styles.dockedSidebar}>
          <Sidebar variant={isDocked && isExpanded ? "full" : "mini"} />
        </div>
        <main className={styles.main}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {isDrawerOpen && (
        <>
          <div className={styles.backdrop} onClick={closeDrawer} aria-hidden="true" />
          <Sidebar variant="drawer" onClose={closeDrawer} />
        </>
      )}
    </div>
  );
}
