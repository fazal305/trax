import { useState } from "react";
import { X } from "lucide-react";
import styles from "./ChecklistSection.module.css";

export function ChecklistSection({ checklist, onAddItem, onToggleItem, onRemoveItem }) {
  const [newItemText, setNewItemText] = useState("");
  const doneCount = checklist.filter((item) => item.done).length;
  const percent = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setNewItemText("");
  }

  return (
    <div className={styles.wrapper}>
      {checklist.length > 0 && (
        <div className={styles.progress}>
          <span className={styles.progressLabel}>{percent}%</span>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <ul className={styles.items}>
        {checklist.map((item) => (
          <li key={item.id} className={styles.item}>
            <label className={styles.itemLabel}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggleItem(item.id)}
                className={styles.checkbox}
              />
              <span className={item.done ? `${styles.itemText} ${styles.done}` : styles.itemText}>
                {item.text}
              </span>
            </label>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemoveItem(item.id)}
              aria-label={`Remove ${item.text}`}
            >
              <X aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className={styles.addForm}>
        <input
          className={styles.addInput}
          value={newItemText}
          onChange={(event) => setNewItemText(event.target.value)}
          placeholder="Add an item…"
        />
        <button type="submit" className={styles.addButton} disabled={!newItemText.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
