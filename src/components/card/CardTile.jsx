import { memo, useMemo } from "react";
import { Calendar, CheckSquare, Paperclip } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { MemberAvatar } from "../common/MemberAvatar";
import { getPriority } from "../../constants/priority";
import { formatDueDate, isOverdue } from "../../utils/date";
import styles from "./CardTile.module.css";

function CardTileComponent({ cardId, onOpen }) {
  const { cards, labels, members } = useData();
  const card = cards.byId[cardId];

  const cardLabels = useMemo(
    () => card.labelIds.map((id) => labels.byId[id]).filter(Boolean),
    [card.labelIds, labels],
  );
  const cardMembers = useMemo(
    () => card.memberIds.map((id) => members.byId[id]).filter(Boolean),
    [card.memberIds, members],
  );
  const checklistDone = card.checklist.filter((item) => item.done).length;
  const priority = getPriority(card.priority);
  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;

  return (
    <button type="button" className={styles.tile} onClick={() => onOpen(card.id)}>
      {card.coverColor && <span className={styles.cover} style={{ background: card.coverColor }} />}

      {cardLabels.length > 0 && (
        <div className={styles.labels}>
          {cardLabels.map((label) => (
            <span key={label.id} className={styles.label} style={{ background: label.color }}>
              {label.name}
            </span>
          ))}
        </div>
      )}

      <span className={styles.title}>{card.title}</span>

      {(card.dueDate || card.checklist.length > 0 || card.attachments.length > 0 || card.priority !== "none" || cardMembers.length > 0) && (
        <div className={styles.footer}>
          <div className={styles.badges}>
            {card.priority !== "none" && (
              <span
                className={styles.priorityDot}
                style={{ background: priority.color }}
                title={`${priority.label} priority`}
              />
            )}
            {card.dueDate && (
              <span className={overdue ? `${styles.badge} ${styles.overdue}` : styles.badge}>
                <Calendar aria-hidden="true" />
                {formatDueDate(card.dueDate)}
              </span>
            )}
            {card.checklist.length > 0 && (
              <span className={styles.badge}>
                <CheckSquare aria-hidden="true" />
                {checklistDone}/{card.checklist.length}
              </span>
            )}
            {card.attachments.length > 0 && (
              <span className={styles.badge}>
                <Paperclip aria-hidden="true" />
                {card.attachments.length}
              </span>
            )}
          </div>

          {cardMembers.length > 0 && (
            <div className={styles.members}>
              {cardMembers.map((member) => (
                <MemberAvatar key={member.id} member={member} size="sm" />
              ))}
            </div>
          )}
        </div>
      )}
    </button>
  );
}

export const CardTile = memo(CardTileComponent);
