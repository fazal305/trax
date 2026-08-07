import { memo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import styles from "./WorkspaceSummaryCard.module.css";

function WorkspaceSummaryCardComponent({ workspace, projectCount, boardCount, onToggleFavorite }) {
  return (
    <Link to={ROUTES.workspace(workspace.id)} className={styles.row}>
      <span className={styles.avatar} style={{ background: workspace.color }} aria-hidden="true">
        {workspace.name.charAt(0).toUpperCase()}
      </span>
      <span className={styles.info}>
        <span className={styles.name}>{workspace.name}</span>
        <span className={styles.meta}>
          {projectCount} project{projectCount === 1 ? "" : "s"} · {boardCount} board
          {boardCount === 1 ? "" : "s"}
        </span>
      </span>
      <button
        className={styles.favoriteButton}
        onClick={(event) => {
          event.preventDefault();
          onToggleFavorite(workspace.id, !workspace.favorite);
        }}
        aria-label={workspace.favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={workspace.favorite}
      >
        <Star
          className={styles.favoriteIcon}
          fill={workspace.favorite ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>
    </Link>
  );
}

export const WorkspaceSummaryCard = memo(WorkspaceSummaryCardComponent);
