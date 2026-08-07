import { ArchiveRestore, Trash2 } from "lucide-react";
import { Modal } from "../modal/Modal";
import { EmptyState } from "../common/EmptyState";
import styles from "./ArchivedCardsPanel.module.css";

export function ArchivedCardsPanel({ isOpen, onClose, cards, onRestore, onDeletePermanently, onOpen }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archived cards" size="sm">
      {cards.length > 0 ? (
        <ul className={styles.list}>
          {cards.map((card) => (
            <li key={card.id} className={styles.row}>
              <button type="button" className={styles.name} onClick={() => onOpen(card.id)}>
                {card.title}
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => onRestore(card.id)}
                aria-label={`Restore ${card.title}`}
                title="Restore"
              >
                <ArchiveRestore aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.danger}`}
                onClick={() => onDeletePermanently(card.id)}
                aria-label={`Permanently delete ${card.title}`}
                title="Delete permanently"
              >
                <Trash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No archived cards" description="Cards you archive will show up here." />
      )}
    </Modal>
  );
}
