import { useState, useRef, useEffect } from "react";
import styles from "./EditableHeading.module.css";

// Click-to-rename heading used by Workspace/Project/Board pages. Enter or
// blur saves, Escape cancels back to the previous value.
export function EditableHeading({ value, onSave, level = 1, className = "" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);
  const HeadingTag = `h${level}`;

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function startEditing() {
    setDraft(value);
    setIsEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <HeadingTag className={className}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            commit();
          }}
        >
          <input
            ref={inputRef}
            className={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
          />
        </form>
      </HeadingTag>
    );
  }

  return (
    <HeadingTag className={className}>
      <button type="button" className={styles.button} onClick={startEditing} title="Click to rename">
        {value}
      </button>
    </HeadingTag>
  );
}
