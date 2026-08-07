// Route patterns for <Route path> registration.
export const ROUTE_PATTERNS = {
  dashboard: "/",
  workspace: "/workspace/:workspaceId",
  project: "/workspace/:workspaceId/project/:projectId",
  board: "/board/:boardId",
  search: "/search",
  settings: "/settings",
  activity: "/activity",
  help: "/help",
};

// Builder functions for links/navigation — keeps path interpolation in one
// place instead of scattered template strings.
export const ROUTES = {
  dashboard: () => "/",
  workspace: (workspaceId) => `/workspace/${workspaceId}`,
  project: (workspaceId, projectId) =>
    `/workspace/${workspaceId}/project/${projectId}`,
  board: (boardId) => `/board/${boardId}`,
  search: () => "/search",
  settings: () => "/settings",
  activity: () => "/activity",
  help: () => "/help",
};
