import styles from "./LoadingOverlay.module.css";

// `fullscreen` for route-level Suspense fallbacks; inline (default) for
// scoping the overlay to a single card/panel while it loads.
export function LoadingOverlay({ label = "Loading…", fullscreen = false }) {
  return (
    <div
      className={fullscreen ? styles.fullscreen : styles.inline}
      role="status"
      aria-live="polite"
    >
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
