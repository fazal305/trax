import { useState } from "react";
import { History } from "lucide-react";
import { MemberAvatar } from "../common/MemberAvatar";
import { formatRelativeTime } from "../../utils/date";
import styles from "./ActivitySection.module.css";

export function ActivitySection({ entries, currentUser, membersById, onAddComment }) {
  const [commentText, setCommentText] = useState("");

  // Newest first, like Trello's card activity feed.
  const sorted = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setCommentText("");
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.composer}>
        <MemberAvatar member={currentUser} size="sm" />
        <div className={styles.composerInputArea}>
          <textarea
            className={styles.textarea}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a comment…"
            rows={2}
          />
          <button type="submit" className={styles.submitButton} disabled={!commentText.trim()}>
            Comment
          </button>
        </div>
      </form>

      <ul className={styles.feed}>
        {sorted.map((entry) => {
          const actor = membersById[entry.actorId];
          return (
            <li key={entry.id} className={styles.entry}>
              {actor ? (
                <MemberAvatar member={actor} size="sm" />
              ) : (
                <History className={styles.systemIcon} aria-hidden="true" />
              )}
              <div className={styles.entryBody}>
                {entry.type === "comment" ? (
                  <>
                    <div className={styles.entryHeader}>
                      <span className={styles.actorName}>{actor?.name ?? "Someone"}</span>
                      <span className={styles.timestamp}>{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                    <p className={styles.commentText}>{entry.text}</p>
                  </>
                ) : (
                  <p className={styles.systemText}>
                    <span className={styles.actorName}>{actor?.name ?? "Someone"}</span> {entry.message}
                    <span className={styles.timestamp}> · {formatRelativeTime(entry.createdAt)}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
