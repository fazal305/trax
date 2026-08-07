import { useRef } from "react";
import { Paperclip, X, File } from "lucide-react";
import styles from "./AttachmentsSection.module.css";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsSection({ attachments, onAdd, onRemove }) {
  const fileInputRef = useRef(null);

  function handleFilesSelected(event) {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) {
      // Metadata only — we never read or store the actual file bytes.
      onAdd({ name: file.name, size: file.size, type: file.type || "unknown" });
    }
    event.target.value = "";
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {attachments.map((attachment) => (
          <li key={attachment.id} className={styles.item}>
            <File className={styles.icon} aria-hidden="true" />
            <div className={styles.info}>
              <span className={styles.name}>{attachment.name}</span>
              <span className={styles.meta}>{formatSize(attachment.size)}</span>
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
            >
              <X aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.addButton} onClick={() => fileInputRef.current?.click()}>
        <Paperclip aria-hidden="true" />
        Add attachment
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className={styles.hiddenInput}
        onChange={handleFilesSelected}
      />
    </div>
  );
}
