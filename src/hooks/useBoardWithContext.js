import { useMemo } from "react";
import { useData } from "../contexts/DataContext";

// Joins a board up to its project and workspace — the same lookup is needed
// anywhere a board is shown outside of its own board page (Dashboard cards,
// breadcrumbs, search results), so it's centralized here instead of
// duplicated per component.
export function useBoardWithContext(boardId) {
  const { boards, projects, workspaces } = useData();

  return useMemo(() => {
    const board = boards.byId[boardId];
    if (!board) return null;
    const project = projects.byId[board.projectId] ?? null;
    const workspace = project ? (workspaces.byId[project.workspaceId] ?? null) : null;
    return { board, project, workspace };
  }, [boards, projects, workspaces, boardId]);
}
