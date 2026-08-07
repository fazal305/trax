import { Search, X } from "lucide-react";
import styles from "./SearchInput.module.css";

export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Search className={styles.icon} aria-hidden="true" />
      <input
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
