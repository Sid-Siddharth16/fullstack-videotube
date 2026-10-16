import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { ROUTES } from "../../constants/route.constant";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/auth.slice";
import type { User } from "../../types/user.types";
import { getInitials } from "../../utils/format.helper";
import Spinner from "../ui/Spinner";
import { ChevronDownIcon, LogoutIcon, SettingsIcon, UserIcon, VideoIcon } from "./icons";
import styles from "./ProfileMenu.module.css";

interface MenuLink {
  label: string;
  to: string;
  icon: ReactNode;
}

const MENU_LINKS: MenuLink[] = [
  { label: "Profile", to: ROUTES.PROFILE, icon: <UserIcon /> },
  { label: "My videos", to: ROUTES.MY_VIDEOS, icon: <VideoIcon /> },
  { label: "Change Password", to: ROUTES.CHANGE_PASSWORD, icon: <SettingsIcon /> },
  { label: "Settings", to: ROUTES.SETTINGS, icon: <SettingsIcon /> },
];

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

export default function ProfileMenu({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getItems = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? []);

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  // While open: focus the first item and close on any click outside the menu
  useEffect(() => {
    if (!isOpen) return;
    getItems()[0]?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) => items[(next + items.length) % items.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await dispatch(logout());
  };

  const avatar = user.avatar ? (
    <img src={user.avatar} alt="" className={styles.avatar} />
  ) : (
    <span className={styles.avatar}>{getInitials(user.fullName)}</span>
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Account menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {avatar}
        {/* <span className={styles.triggerName}>{user.userName}</span> */}
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Account"
          className={styles.menu}
          onKeyDown={handleMenuKeyDown}
        >
          <div className={styles.header}>
            {avatar}
            <div className={styles.headerText}>
              <p className={styles.headerName}>{user.fullName}</p>
              <p className={styles.headerEmail}>{user.email}</p>
            </div>
          </div>

          <div className={styles.divider} role="separator" />

          {MENU_LINKS.map(({ label, to, icon }) => (
            <Link key={to} to={to} role="menuitem" className={styles.item} onClick={() => closeMenu()}>
              {icon}
              {label}
            </Link>
          ))}

          <div className={styles.divider} role="separator" />

          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.danger}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Spinner size={18} /> : <LogoutIcon />}
            {isLoggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
