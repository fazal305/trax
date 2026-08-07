import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Archive, ArchiveRestore, Trash2, Layers, Plus } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { EmptyState } from "../../components/common/EmptyState";
import { EditableHeading } from "../../components/common/EditableHeading";
import { ConfirmDialog } from "../../components/modal/ConfirmDialog";
import { BoardCard } from "../../components/board/BoardCard";
import { CreateBoardModal } from "../../components/board/CreateBoardModal";
import { ROUTES } from "../../constants/routes";
import styles from "./Project.module.css";

export default function Project() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projects, boards, updateProject, updateBoard, deleteProject } = useData();

  const project = projects.byId[projectId];
  const workspace = workspaces.byId[workspaceId];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(project?.description ?? "");
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [showArchivedBoards, setShowArchivedBoards] = useState(false);
  const descriptionInputRef = useRef(null);

  useEffect(() => {
    if (isEditingDescription) descriptionInputRef.current?.focus();
  }, [isEditingDescription]);

  const projectBoardIds = useMemo(
    () => (project ? boards.allIds.filter((id) => boards.byId[id].projectId === project.id) : []),
    [project, boards],
  );

  const visibleBoardIds = useMemo(
    () => projectBoardIds.filter((id) => showArchivedBoards || !boards.byId[id].archived),
    [projectBoardIds, boards, showArchivedBoards],
  );

  const handleRename = useCallback(
    (name) => updateProject(project.id, { name }),
    [project, updateProject],
  );

  const handleSaveDescription = useCallback(() => {
    updateProject(project.id, { description: descriptionDraft.trim() });
    setIsEditingDescription(false);
  }, [project, descriptionDraft, updateProject]);

  const handleToggleArchive = useCallback(() => {
    updateProject(project.id, { archived: !project.archived });
  }, [project, updateProject]);

  const handleToggleBoardFavorite = useCallback(
    (boardId, favorite) => updateBoard(boardId, { favorite }),
    [updateBoard],
  );

  const handleToggleBoardArchive = useCallback(
    (boardId, archived) => updateBoard(boardId, { archived }),
    [updateBoard],
  );

  const handleDelete = useCallback(() => {
    deleteProject(project.id);
    navigate(ROUTES.workspace(workspaceId));
  }, [project, deleteProject, navigate, workspaceId]);

  if (!project || !workspace) {
    return <EmptyState title="Project not found" description="It may have been deleted or archived." />;
  }

  return (
    <div className={styles.page}>
      <Link to={ROUTES.workspace(workspace.id)} className={styles.breadcrumb}>
        &larr; {workspace.name}
      </Link>

      <header className={styles.header}>
        <span className={styles.colorSwatch} style={{ background: project.color }} aria-hidden="true" />
        <div className={styles.titleArea}>
          <EditableHeading value={project.name} onSave={handleRename} />
          <span className={styles.meta}>
            {projectBoardIds.length} board{projectBoardIds.length === 1 ? "" : "s"}
            {project.archived && <span className={styles.archivedBadge}>Archived</span>}
          </span>
        </div>
        <button
          type="button"
          className={styles.archiveButton}
          onClick={handleToggleArchive}
          aria-pressed={project.archived}
        >
          {project.archived ? (
            <>
              <ArchiveRestore aria-hidden="true" />
              Restore
            </>
          ) : (
            <>
              <Archive aria-hidden="true" />
              Archive
            </>
          )}
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Description</h2>
        {isEditingDescription ? (
          <div className={styles.descriptionEditor}>
            <textarea
              ref={descriptionInputRef}
              className={styles.descriptionInput}
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              onBlur={handleSaveDescription}
              rows={3}
            />
            <div className={styles.descriptionActions}>
              <button
                type="button"
                className={styles.descriptionCancelButton}
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.descriptionSaveButton}
                onClick={handleSaveDescription}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.descriptionButton}
            onClick={() => {
              setDescriptionDraft(project.description);
              setIsEditingDescription(true);
            }}
          >
            {project.description || "Add a description…"}
          </button>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Boards</h2>
          <div className={styles.boardToolbar}>
            <button
              type="button"
              className={styles.archiveToggle}
              onClick={() => setShowArchivedBoards((show) => !show)}
              aria-pressed={showArchivedBoards}
            >
              {showArchivedBoards ? "Hide archived" : "Show archived"}
            </button>
            <button
              type="button"
              className={styles.newBoardButton}
              onClick={() => setCreateBoardOpen(true)}
            >
              <Plus aria-hidden="true" />
              New board
            </button>
          </div>
        </div>

        {visibleBoardIds.length > 0 ? (
          <div className={styles.boardGrid}>
            {visibleBoardIds.map((id) => (
              <BoardCard
                key={id}
                boardId={id}
                onToggleFavorite={handleToggleBoardFavorite}
                onToggleArchive={handleToggleBoardArchive}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title={projectBoardIds.length > 0 ? "No archived boards" : "No boards yet"}
            description={
              projectBoardIds.length > 0
                ? "Boards you archive will show up here."
                : "Create your first board to start organizing lists and cards."
            }
          />
        )}
      </section>

      <section className={styles.dangerZone}>
        <div>
          <h2 className={styles.sectionTitle}>Delete this project</h2>
          <p className={styles.dangerDescription}>
            Permanently deletes this project and all of its boards, lists, and cards. This
            can&rsquo;t be undone.
          </p>
        </div>
        <button className={styles.deleteButton} onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 aria-hidden="true" />
          Delete project
        </button>
      </section>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete project?"
        description={`This will permanently delete "${project.name}" and all of its boards and cards.`}
        confirmLabel="Delete project"
        danger
      />

      <CreateBoardModal
        isOpen={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
        projectId={project.id}
        onCreated={(boardId) => navigate(ROUTES.board(boardId))}
      />
    </div>
  );
}
