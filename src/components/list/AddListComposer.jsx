import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import styles from "./AddListComposer.module.css";

export const AddListComposer = forwardRef(function AddListComposer({ onCreate }, ref) {
  const [isComposing, setIsComposing] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  // Lets the "L" keyboard shortcut (wired in Board.jsx) open this composer
  // without lifting its open/closed state up.
  useImperativeHandle(ref, () => ({ open: () => setIsComposing(true) }));

  useEffect(() => {
    if (isComposing) inputRef.current?.focus();
  }, [isComposing]);

  function close() {
    setName("");
    setIsComposing(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      close();
      return;
    }
    onCreate(trimmed);
    setName("");
    // Stay in composing mode so adding several lists in a row is fast —
    // matches the common Trello-style "quick add" flow.
    inputRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") close();
  }

  if (!isComposing) {
    return (
      <button type="button" className={styles.trigger} onClick={() => setIsComposing(true)}>
        <Plus aria-hidden="true" />
        Add another list
      </button>
    );
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={close}
        placeholder="Enter list name…"
      />
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.addButton}
          onMouseDown={(event) => event.preventDefault()}
        >
          Add list
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onMouseDown={(event) => event.preventDefault()}
          onClick={close}
          aria-label="Cancel"
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </form>
  );
});
