const MAX_RECENT_BOARDS = 6;

export const UI_ACTIONS = {
  TOGGLE_SIDEBAR_COLLAPSED: "ui/toggleSidebarCollapsed",
  SET_SIDEBAR_COLLAPSED: "ui/setSidebarCollapsed",
  ADD_RECENT_BOARD: "ui/addRecentBoard",
  SET_ACTIVE_WORKSPACE: "ui/setActiveWorkspace",
  MARK_NOTIFICATIONS_SEEN: "ui/markNotificationsSeen",
};

export function uiReducer(state, action) {
  switch (action.type) {
    case UI_ACTIONS.TOGGLE_SIDEBAR_COLLAPSED:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case UI_ACTIONS.SET_SIDEBAR_COLLAPSED:
      return { ...state, sidebarCollapsed: action.payload.collapsed };

    case UI_ACTIONS.ADD_RECENT_BOARD: {
      const { boardId } = action.payload;
      const withoutDuplicate = state.recentBoardIds.filter((id) => id !== boardId);
      return {
        ...state,
        recentBoardIds: [boardId, ...withoutDuplicate].slice(0, MAX_RECENT_BOARDS),
      };
    }

    case UI_ACTIONS.SET_ACTIVE_WORKSPACE:
      return { ...state, activeWorkspaceId: action.payload.workspaceId };

    case UI_ACTIONS.MARK_NOTIFICATIONS_SEEN:
      return { ...state, notificationsLastSeenAt: new Date().toISOString() };

    default:
      return state;
  }
}
