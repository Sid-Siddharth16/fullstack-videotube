import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "../../constants/route.constant";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `${ROUTES.Home}/results?query=${encodeURIComponent(trimmed)}` : ROUTES.Home);
  };

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <input
        type="search"
        className={styles.input}
        placeholder="Search"
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.button} aria-label="Submit search">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
