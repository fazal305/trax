import { ArchiveRestore, Trash2 } from "lucide-react";
import { Modal } from "../modal/Modal";
import { EmptyState } from "../common/EmptyState";
import styles from "./ArchivedListsPanel.module.css";

export function ArchivedListsPanel({ isOpen, onClose, lists, onRestore, onDeletePermanently }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archived lists" size="sm">
      {lists.length > 0 ? (
        <ul className={styles.list}>
          {lists.map((list) => (
            <li key={list.id} className={styles.row}>
              <span className={styles.name}>{list.name}</span>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => onRestore(list.id)}
                aria-label={`Restore ${list.name}`}
                title="Restore"
              >
                <ArchiveRestore aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.danger}`}
                onClick={() => onDeletePermanently(list.id)}
                aria-label={`Permanently delete ${list.name}`}
                title="Delete permanently"
              >
                <Trash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No archived lists" description="Lists you archive will show up here." />
      )}
    </Modal>
  );
}
