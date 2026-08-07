import { useState, useRef, useCallback } from "react";
import { Flag } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { PRIORITIES, getPriority } from "../../constants/priority";
import styles from "./PrioritySelect.module.css";

export function PrioritySelect({ priority, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const current = getPriority(priority);

  return (
    <div className={styles.container} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        <Flag style={{ color: current.color }} aria-hidden="true" />
        {current.label} priority
      </button>

      {open && (
        <div className={styles.menu} role="listbox">
          {PRIORITIES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              role="option"
              aria-selected={priority === option.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
            >
              <Flag style={{ color: option.color }} aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
