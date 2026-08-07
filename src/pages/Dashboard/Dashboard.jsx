import { useMemo, useCallback } from "react";
import { Star, Clock, Layers } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useUI } from "../../contexts/UIContext";
import { useUser } from "../../contexts/UserContext";
import { BoardCard } from "../../components/board/BoardCard";
import { WorkspaceSummaryCard } from "../../components/workspace/WorkspaceSummaryCard";
import { EmptyState } from "../../components/common/EmptyState";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { workspaces, projects, boards, updateBoard, updateWorkspace } = useData();
  const { recentBoardIds } = useUI();
  const { currentUser } = useUser();

  const favoriteBoardIds = useMemo(
    () => boards.allIds.filter((id) => boards.byId[id].favorite),
    [boards],
  );

  const validRecentBoardIds = useMemo(
    () => recentBoardIds.filter((id) => boards.byId[id]),
    [recentBoardIds, boards],
  );

  const workspaceSummaries = useMemo(
    () =>
      workspaces.allIds.map((id) => {
        const workspaceProjectIds = projects.allIds.filter(
          (projectId) => projects.byId[projectId].workspaceId === id,
        );
        const boardCount = boards.allIds.filter((boardId) =>
          workspaceProjectIds.includes(boards.byId[boardId].projectId),
        ).length;
        return {
          workspace: workspaces.byId[id],
          projectCount: workspaceProjectIds.length,
          boardCount,
        };
      }),
    [workspaces, projects, boards],
  );

  const handleToggleBoardFavorite = useCallback(
    (boardId, favorite) => updateBoard(boardId, { favorite }),
    [updateBoard],
  );

  const handleToggleWorkspaceFavorite = useCallback(
    (workspaceId, favorite) => updateWorkspace(workspaceId, { favorite }),
    [updateWorkspace],
  );

  return (
    <div className={styles.page}>
      <h1>Welcome back, {currentUser.name}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Star className={styles.sectionIcon} aria-hidden="true" />
          Favorite boards
        </h2>
        {favoriteBoardIds.length > 0 ? (
          <div className={styles.boardGrid}>
            {favoriteBoardIds.map((id) => (
              <BoardCard key={id} boardId={id} onToggleFavorite={handleToggleBoardFavorite} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No favorite boards yet"
            description="Star a board to pin it here for quick access."
          />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Clock className={styles.sectionIcon} aria-hidden="true" />
          Recent boards
        </h2>
        {validRecentBoardIds.length > 0 ? (
          <div className={styles.boardGrid}>
            {validRecentBoardIds.map((id) => (
              <BoardCard key={id} boardId={id} onToggleFavorite={handleToggleBoardFavorite} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No recent boards"
            description="Boards you open will show up here."
          />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Layers className={styles.sectionIcon} aria-hidden="true" />
          Workspaces
        </h2>
        <div className={styles.workspaceList}>
          {workspaceSummaries.map(({ workspace, projectCount, boardCount }) => (
            <WorkspaceSummaryCard
              key={workspace.id}
              workspace={workspace}
              projectCount={projectCount}
              boardCount={boardCount}
              onToggleFavorite={handleToggleWorkspaceFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
