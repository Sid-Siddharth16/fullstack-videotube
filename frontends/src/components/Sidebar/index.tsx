import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { APP_NAME } from "../../constants/app.constant";
import { ROUTES } from "../../constants/route.constant";
import { SettingsIcon } from "../ProfileMenu/icons";
import {
  ChannelIcon,
  ChevronRightIcon,
  ClockIcon,
  HistoryIcon,
  HomeIcon,
  MenuIcon,
  PlayBoxIcon,
  PlaylistIcon,
  // ShortsIcon,
  SubscriptionsIcon,
  ThumbsUpIcon,
  YouIcon,
} from "./icons";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

interface NavSection {
  title?: { label: string; to: string };
  items: NavItem[];
}

// Collapsed rail: the few top-level destinations, icon over label
const MINI_ITEMS: NavItem[] = [
  { label: "Home", to: ROUTES.Home, icon: <HomeIcon /> },
  // { label: "Shorts", to: ROUTES.SHORTS, icon: <ShortsIcon /> },
  { label: "Subscriptions", to: ROUTES.SUBSCRIPTIONS, icon: <SubscriptionsIcon /> },
  { label: "You", to: ROUTES.PROFILE, icon: <YouIcon /> },
];

const FULL_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Home", to: ROUTES.Home, icon: <HomeIcon /> },
      // { label: "Shorts", to: ROUTES.SHORTS, icon: <ShortsIcon /> },
      { label: "Subscriptions", to: ROUTES.SUBSCRIPTIONS, icon: <SubscriptionsIcon /> },
    ],
  },
  {
    title: { label: "You", to: ROUTES.PROFILE },
    items: [
      { label: "Your channel", to: ROUTES.PROFILE, icon: <ChannelIcon /> },
      { label: "History", to: ROUTES.HISTORY, icon: <HistoryIcon /> },
      { label: "Playlists", to: ROUTES.PLAYLISTS, icon: <PlaylistIcon /> },
      { label: "Watch later", to: ROUTES.WATCH_LATER, icon: <ClockIcon /> },
      { label: "Liked videos", to: ROUTES.LIKED_VIDEOS, icon: <ThumbsUpIcon /> },
      { label: "Your videos", to: ROUTES.MY_VIDEOS, icon: <PlayBoxIcon /> },
    ],
  },
  {
    items: [{ label: "Settings", to: ROUTES.SETTINGS, icon: <SettingsIcon /> }],
  },
];

const linkClass =
  (base: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive ? `${base} ${styles.active}` : base;

interface SidebarProps {
  // "full" and "mini" are docked beside the content; "drawer" overlays it
  variant: "full" | "mini" | "drawer";
  onClose?: () => void;
}

export default function Sidebar({ variant, onClose }: SidebarProps) {
  if (variant === "mini") {
    return (
      <nav className={styles.mini} aria-label="Sidebar">
        {MINI_ITEMS.map(({ label, to, icon }) => (
          <NavLink key={to} to={to} end={to === ROUTES.Home} className={linkClass(styles.miniItem)}>
            {icon}
            <span className={styles.miniLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  const isDrawer = variant === "drawer";

  return (
    <nav className={isDrawer ? `${styles.full} ${styles.drawer}` : styles.full} aria-label="Sidebar">
      {isDrawer && (
        <div className={styles.drawerHeader}>
          <button type="button" className={styles.menuButton} onClick={onClose} aria-label="Close menu">
            <MenuIcon />
          </button>
          <Link to={ROUTES.Home} className={styles.brand} onClick={onClose}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span>{APP_NAME}</span>
          </Link>
        </div>
      )}

      <div className={styles.scroll}>
        {FULL_SECTIONS.map((section, index) => (
          <div key={section.title?.label ?? index} className={styles.section}>
            {section.title && (
              <Link to={section.title.to} className={styles.sectionTitle} onClick={onClose}>
                {section.title.label}
                <ChevronRightIcon />
              </Link>
            )}
            {section.items.map(({ label, to, icon }) => (
              <NavLink
                key={label}
                to={to}
                end={to === ROUTES.Home}
                className={linkClass(styles.item)}
                onClick={onClose}
              >
                {icon}
                <span className={styles.itemLabel}>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
