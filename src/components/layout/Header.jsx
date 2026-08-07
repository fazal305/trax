import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Sun, Moon, Command } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { NotificationsPanel } from "../notification/NotificationsPanel";
import { generateAvatarDataUri } from "../../utils/avatar";
import { ROUTES } from "../../constants/routes";
import styles from "./Header.module.css";

export function Header({ onOpenMobileNav, onOpenCommandPalette }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const avatarSrc = useMemo(
    () => generateAvatarDataUri(currentUser.avatarSeed),
    [currentUser.avatarSeed],
  );

  return (
    <header className={styles.header}>
      <button
        className={styles.mobileNavButton}
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu aria-hidden="true" />
      </button>

      <button
        className={styles.searchTrigger}
        onClick={() => navigate(ROUTES.search())}
      >
        <Search className={styles.searchIcon} aria-hidden="true" />
        <span className={styles.searchPlaceholder}>Search boards, cards, members…</span>
        <kbd className={styles.shortcutHint}>/</kbd>
      </button>

      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          onClick={onOpenCommandPalette}
          title="Command palette (Ctrl+K)"
          aria-label="Open command palette"
        >
          <Command aria-hidden="true" />
        </button>

        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
        >
          {resolvedTheme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>

        <NotificationsPanel />

        <button className={styles.avatarButton} aria-label="Account menu">
          <img
            src={avatarSrc}
            alt={currentUser.name}
            className={styles.avatar}
            width={32}
            height={32}
          />
        </button>
      </div>
    </header>
  );
}
