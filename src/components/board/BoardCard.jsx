import { memo } from "react";
import { Link } from "react-router-dom";
import { Star, Archive, ArchiveRestore } from "lucide-react";
import { useBoardWithContext } from "../../hooks/useBoardWithContext";
import { ROUTES } from "../../constants/routes";
import styles from "./BoardCard.module.css";

function BoardCardComponent({ boardId, onToggleFavorite, onToggleArchive }) {
  const context = useBoardWithContext(boardId);
  if (!context) return null;
  const { board, project, workspace } = context;

  return (
    <Link
      to={ROUTES.board(board.id)}
      className={board.archived ? `${styles.card} ${styles.archived}` : styles.card}
    >
      <div className={styles.cover} style={{ background: board.background }} />
      <div className={styles.body}>
        <span className={styles.title}>{board.name}</span>
        <span className={styles.breadcrumb}>
          {workspace?.name} {project ? `/ ${project.name}` : ""}
        </span>
      </div>

      {onToggleArchive && (
        <button
          className={styles.archiveButton}
          onClick={(event) => {
            event.preventDefault();
            onToggleArchive(board.id, !board.archived);
          }}
          aria-label={board.archived ? "Restore board" : "Archive board"}
        >
          {board.archived ? (
            <ArchiveRestore className={styles.archiveIcon} aria-hidden="true" />
          ) : (
            <Archive className={styles.archiveIcon} aria-hidden="true" />
          )}
        </button>
      )}

      <button
        className={styles.favoriteButton}
        onClick={(event) => {
          event.preventDefault();
          onToggleFavorite(board.id, !board.favorite);
        }}
        aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={board.favorite}
      >
        <Star className={styles.favoriteIcon} fill={board.favorite ? "currentColor" : "none"} aria-hidden="true" />
      </button>
    </Link>
  );
}

// Skips re-rendering when the parent (e.g. a grid of many cards) re-renders
// with the same boardId/onToggleFavorite — doesn't insulate from DataContext
// changes, since useBoardWithContext subscribes to that context directly.
export const BoardCard = memo(BoardCardComponent);
