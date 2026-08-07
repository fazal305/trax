import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

export function Modal({ isOpen, onClose, title, children, size = "md", initialFocusRef }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;
    (initialFocusRef?.current ?? panelRef.current)?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isOpen) return null;

  return createPortal(
    // The backdrop wraps the real dialog (below), so it can't be aria-hidden
    // — that would hide the dialog from assistive tech too. Its click-to-
    // close is a pointer-only convenience; Escape and the Close button
    // already give keyboard/AT users a fully accessible way to dismiss.
    // Checking event.target here (instead of stopPropagation on the panel)
    // means the panel itself needs no handler of its own.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close dialog">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
