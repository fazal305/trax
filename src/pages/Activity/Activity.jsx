import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { History, MessageSquare } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { MemberAvatar } from "../../components/common/MemberAvatar";
import { EmptyState } from "../../components/common/EmptyState";
import { formatRelativeTime } from "../../utils/date";
import { ROUTES } from "../../constants/routes";
import styles from "./Activity.module.css";

export default function Activity() {
  const { activity, cards, lists, boards, members } = useData();
  const navigate = useNavigate();

  const entries = useMemo(() => {
    return activity.allIds
      .map((id) => activity.byId[id])
      .map((entry) => {
        const card = cards.byId[entry.cardId];
        const list = card ? lists.byId[card.listId] : null;
        const board = list ? boards.byId[list.boardId] : null;
        return { ...entry, card, board };
      })
      .filter((entry) => entry.card && entry.board)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [activity, cards, lists, boards]);

  return (
    <div className={styles.page}>
      <h1>Activity</h1>
      <p className={styles.subtitle}>What&rsquo;s happened recently across your boards.</p>

      {entries.length > 0 ? (
        <ul className={styles.feed}>
          {entries.map((entry) => {
            const actor = members.byId[entry.actorId];
            return (
              <li key={entry.id} className={styles.entry}>
                {actor ? (
                  <MemberAvatar member={actor} size="sm" />
                ) : (
                  <History className={styles.systemIcon} aria-hidden="true" />
                )}
                <div className={styles.entryBody}>
                  <button
                    type="button"
                    className={styles.entryText}
                    onClick={() =>
                      navigate(ROUTES.board(entry.board.id), { state: { openCardId: entry.card.id } })
                    }
                  >
                    <span className={styles.actorName}>{actor?.name ?? "Someone"}</span>{" "}
                    {entry.type === "comment" ? (
                      <>
                        commented on <span className={styles.cardTitle}>{entry.card.title}</span>
                      </>
                    ) : (
                      <>
                        {entry.message} on <span className={styles.cardTitle}>{entry.card.title}</span>
                      </>
                    )}
                  </button>
                  {entry.type === "comment" && (
                    <p className={styles.commentPreview}>
                      <MessageSquare className={styles.commentIcon} aria-hidden="true" />
                      {entry.text}
                    </p>
                  )}
                  <div className={styles.entryMeta}>
                    <span className={styles.boardName}>{entry.board.name}</span>
                    <span className={styles.timestamp}>{formatRelativeTime(entry.createdAt)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={History}
          title="No activity yet"
          description="Comments and changes on your cards will show up here."
        />
      )}
    </div>
  );
}
