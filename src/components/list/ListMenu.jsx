import { useState, useRef, useCallback } from "react";
import { MoreHorizontal, Archive, Trash2 } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import styles from "./ListMenu.module.css";

export function ListMenu({ onArchive, onDelete }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="List actions"
      >
        <MoreHorizontal aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            className={styles.menuItem}
            role="menuitem"
            onClick={() => {
              onArchive();
              setOpen(false);
            }}
          >
            <Archive aria-hidden="true" />
            Archive list
          </button>
          <button
            type="button"
            className={`${styles.menuItem} ${styles.danger}`}
            role="menuitem"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete list
          </button>
        </div>
      )}
    </div>
  );
}
