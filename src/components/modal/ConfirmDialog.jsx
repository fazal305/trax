import { Modal } from "./Modal";
import styles from "./ConfirmDialog.module.css";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          className={danger ? styles.dangerButton : styles.confirmButton}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
