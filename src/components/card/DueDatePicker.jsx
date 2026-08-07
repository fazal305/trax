import { useState, useRef, useCallback } from "react";
import { Calendar } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { formatDueDate, isOverdue } from "../../utils/date";
import styles from "./DueDatePicker.module.css";

export function DueDatePicker({ dueDate, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const overdue = dueDate ? isOverdue(dueDate) : false;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={dueDate && overdue ? `${styles.trigger} ${styles.overdue}` : styles.trigger}
        onClick={() => setOpen((o) => !o)}
      >
        <Calendar aria-hidden="true" />
        {dueDate ? formatDueDate(dueDate) : "Due date"}
      </button>

      {open && (
        <div className={styles.menu}>
          <input
            type="date"
            className={styles.input}
            value={dueDate ? dueDate.slice(0, 10) : ""}
            onChange={(event) => {
              const value = event.target.value;
              onChange(value ? new Date(value).toISOString() : null);
            }}
          />
          {dueDate && (
            <button type="button" className={styles.clearButton} onClick={() => onChange(null)}>
              Clear due date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
