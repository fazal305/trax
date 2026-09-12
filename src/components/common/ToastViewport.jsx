import { useToast } from "../../contexts/ToastContext";
import styles from "./ToastViewport.module.css";

// Mounted once near the app root; renders whatever the ToastContext queue
// currently holds.
export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className={styles.viewport} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type] || ""}`}>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.dismissButton}
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
