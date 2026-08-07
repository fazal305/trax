import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import styles from "./AddCardComposer.module.css";

export const AddCardComposer = forwardRef(function AddCardComposer({ onCreate }, ref) {
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef(null);

  // Lets the "N" keyboard shortcut (wired in Board.jsx) open this composer
  // without lifting its open/closed state up.
  useImperativeHandle(ref, () => ({ open: () => setIsComposing(true) }));

  useEffect(() => {
    if (isComposing) textareaRef.current?.focus();
  }, [isComposing]);

  function close() {
    setTitle("");
    setIsComposing(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      close();
      return;
    }
    onCreate(trimmed);
    setTitle("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") close();
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  if (!isComposing) {
    return (
      <button type="button" className={styles.trigger} onClick={() => setIsComposing(true)}>
        <Plus aria-hidden="true" />
        Add a card
      </button>
    );
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={close}
        placeholder="Enter a title for this card…"
        rows={2}
      />
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.addButton}
          onMouseDown={(event) => event.preventDefault()}
        >
          Add card
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
