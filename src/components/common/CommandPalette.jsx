import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Modal } from "../modal/Modal";
import { useTheme } from "../../contexts/ThemeContext";
import { THEME_MODES } from "../../constants/theme";
import { ROUTES } from "../../constants/routes";
import styles from "./CommandPalette.module.css";

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { setMode } = useTheme();
  const inputRef = useRef(null);

  // Reset the query whenever the palette transitions from closed to open —
  // derived at render time (React docs: "Adjusting state when a prop
  // changes") rather than in an effect.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuery("");
  }

  const actions = useMemo(
    () => [
      { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, run: () => navigate(ROUTES.dashboard()) },
      { id: "search", label: "Go to Search", icon: Search, run: () => navigate(ROUTES.search()) },
      { id: "activity", label: "Go to Activity", icon: History, run: () => navigate(ROUTES.activity()) },
      { id: "settings", label: "Go to Settings", icon: Settings, run: () => navigate(ROUTES.settings()) },
      { id: "help", label: "Go to Help", icon: HelpCircle, run: () => navigate(ROUTES.help()) },
      { id: "theme-light", label: "Switch to light theme", icon: Sun, run: () => setMode(THEME_MODES.light) },
      { id: "theme-dark", label: "Switch to dark theme", icon: Moon, run: () => setMode(THEME_MODES.dark) },
      { id: "theme-system", label: "Match system theme", icon: Monitor, run: () => setMode(THEME_MODES.system) },
    ],
    [navigate, setMode],
  );

  const filtered = actions.filter((action) =>
    action.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function runAction(action) {
    action.run();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Command palette" size="sm" initialFocusRef={inputRef}>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type a command…"
          onKeyDown={(event) => {
            if (event.key === "Enter" && filtered[0]) runAction(filtered[0]);
          }}
        />
        <ul className={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((action) => (
              <li key={action.id}>
                <button type="button" className={styles.item} onClick={() => runAction(action)}>
                  <action.icon className={styles.icon} aria-hidden="true" />
                  {action.label}
                </button>
              </li>
            ))
          ) : (
            <li className={styles.empty}>No matching commands.</li>
          )}
        </ul>
      </div>
    </Modal>
  );
}
