import { memo } from "react";
import { Link } from "react-router-dom";
import { Archive, ArchiveRestore } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import styles from "./ProjectCard.module.css";

function ProjectCardComponent({ project, boardCount, onToggleArchive }) {
  return (
    <Link
      to={ROUTES.project(project.workspaceId, project.id)}
      className={project.archived ? `${styles.card} ${styles.archived}` : styles.card}
    >
      <span className={styles.colorBar} style={{ background: project.color }} aria-hidden="true" />
      <div className={styles.body}>
        <span className={styles.name}>{project.name}</span>
        {project.description && <p className={styles.description}>{project.description}</p>}
        <span className={styles.meta}>
          {boardCount} board{boardCount === 1 ? "" : "s"}
        </span>
      </div>
      <button
        className={styles.archiveButton}
        onClick={(event) => {
          event.preventDefault();
          onToggleArchive(project.id, !project.archived);
        }}
        aria-label={project.archived ? "Restore project" : "Archive project"}
      >
        {project.archived ? (
          <ArchiveRestore aria-hidden="true" />
        ) : (
          <Archive aria-hidden="true" />
        )}
      </button>
    </Link>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
