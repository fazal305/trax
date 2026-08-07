import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { useData } from "../../contexts/DataContext";
import { MemberAvatar } from "../../components/common/MemberAvatar";
import { THEME_MODES } from "../../constants/theme";
import styles from "./Settings.module.css";

const THEME_OPTIONS = [
  { id: THEME_MODES.light, label: "Light", icon: Sun },
  { id: THEME_MODES.dark, label: "Dark", icon: Moon },
  { id: THEME_MODES.system, label: "System", icon: Monitor },
];

export default function Settings() {
  const { mode, setMode } = useTheme();
  const { currentUser, updateProfile } = useUser();
  const { members, updateMember } = useData();
  const [name, setName] = useState(currentUser.name);

  // "You" is tracked in two places: UserContext (the app-shell identity —
  // header, Settings) and DataContext's member-you record (the same person
  // as seen everywhere cards/workspaces reference members). Both must be
  // updated together or your name would only change in half the app.
  function handleNameBlur() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== currentUser.name) {
      updateProfile({ name: trimmed });
      updateMember(currentUser.id, { name: trimmed });
    } else {
      setName(currentUser.name);
    }
  }

  const memberRecord = members.byId[currentUser.id];
  const avatarMember = memberRecord ?? currentUser;

  return (
    <div className={styles.page}>
      <h1>Settings</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <p className={styles.description}>Choose how Trax looks on this device.</p>
        <div className={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={mode === option.id ? `${styles.themeOption} ${styles.active}` : styles.themeOption}
              onClick={() => setMode(option.id)}
              aria-pressed={mode === option.id}
            >
              <option.icon aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <div className={styles.profileRow}>
          <MemberAvatar member={avatarMember} size="lg" />
          <label className={styles.field}>
            <span className={styles.label}>Display name</span>
            <input
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
