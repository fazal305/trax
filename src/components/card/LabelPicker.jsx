import { useState, useRef, useCallback } from "react";
import { Check, Tag, Settings } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { LabelManagerModal } from "../label/LabelManagerModal";
import styles from "./LabelPicker.module.css";

export function LabelPicker({ boardId, boardLabels, selectedLabelIds, onToggle }) {
  const [open, setOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  return (
    <div className={styles.container} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        <Tag aria-hidden="true" />
        Labels
      </button>

      {open && (
        <div className={styles.menu} role="listbox">
          {boardLabels.length > 0 ? (
            boardLabels.map((label) => {
              const selected = selectedLabelIds.includes(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  className={styles.option}
                  role="option"
                  aria-selected={selected}
                  onClick={() => onToggle(label.id, !selected)}
                >
                  <span className={styles.swatch} style={{ background: label.color }}>
                    {selected && <Check className={styles.check} aria-hidden="true" />}
                  </span>
                  <span className={styles.name}>{label.name}</span>
                </button>
              );
            })
          ) : (
            <p className={styles.empty}>No labels on this board yet.</p>
          )}
          <button
            type="button"
            className={styles.manageButton}
            onClick={() => {
              setOpen(false);
              setManageOpen(true);
            }}
          >
            <Settings aria-hidden="true" />
            Manage labels
          </button>
        </div>
      )}

      <LabelManagerModal
        isOpen={manageOpen}
        onClose={() => setManageOpen(false)}
        boardId={boardId}
        boardLabels={boardLabels}
      />
    </div>
  );
}
