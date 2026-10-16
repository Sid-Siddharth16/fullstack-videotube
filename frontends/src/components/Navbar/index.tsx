import { Link, useNavigate } from "react-router";
import { APP_NAME } from "../../constants/app.constant";
import { ROUTES } from "../../constants/route.constant";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/auth.slice";
import ProfileMenu from "../ProfileMenu";
import { PlusIcon } from "../ProfileMenu/icons";
import SearchBar from "../SearchBar";
import { MenuIcon } from "../Sidebar/icons";
import Button from "../ui/Button";
import styles from "./Navbar.module.css";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <div className={styles.start}>
          <button type="button" className={styles.menuButton} onClick={onMenuClick} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
          <Link to={ROUTES.Home} className={styles.brand}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span>{APP_NAME}</span>
          </Link>
        </div>

        <SearchBar />

        <div className={styles.actions}>
          <Button
            variant="secondary"
            className={styles.createButton}
            onClick={() => navigate(ROUTES.CREATE)}
            aria-label="Create"
          >
            <PlusIcon />
            <span className={styles.createLabel}>Create</span>
          </Button>
          {user && <ProfileMenu user={user} />}
        </div>
      </nav>
    </header>
  );
}
