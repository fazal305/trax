import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { uiReducer, UI_ACTIONS } from "../reducers/uiReducer";
import { storageService } from "../services/storageService";
import { STORAGE_KEYS } from "../constants/storageKeys";

const UIContext = createContext(null);

// Seeded with a couple of the sample boards so the Dashboard's "Recent
// boards" section isn't empty before the user has visited any board
// themselves; real visits (added by the Board page) push to the front.
const defaultState = {
  sidebarCollapsed: false,
  recentBoardIds: ["board-sprint", "board-roadmap"],
  activeWorkspaceId: "ws-personal",
  notificationsLastSeenAt: null,
};

function loadInitialState() {
  // Merge over defaultState (not replace) so fields added after a user's
  // first visit — like recentBoardIds — get a sane default instead of
  // `undefined` when older persisted data is missing them.
  return { ...defaultState, ...storageService.get(STORAGE_KEYS.ui, defaultState) };
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, undefined, loadInitialState);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.ui, state);
  }, [state]);

  const toggleSidebarCollapsed = useCallback(() => {
    dispatch({ type: UI_ACTIONS.TOGGLE_SIDEBAR_COLLAPSED });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed) => {
    dispatch({ type: UI_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: { collapsed } });
  }, []);

  const addRecentBoard = useCallback((boardId) => {
    dispatch({ type: UI_ACTIONS.ADD_RECENT_BOARD, payload: { boardId } });
  }, []);

  const setActiveWorkspace = useCallback((workspaceId) => {
    dispatch({ type: UI_ACTIONS.SET_ACTIVE_WORKSPACE, payload: { workspaceId } });
  }, []);

  const markNotificationsSeen = useCallback(() => {
    dispatch({ type: UI_ACTIONS.MARK_NOTIFICATIONS_SEEN });
  }, []);

  const value = useMemo(
    () => ({
      sidebarCollapsed: state.sidebarCollapsed,
      recentBoardIds: state.recentBoardIds,
      activeWorkspaceId: state.activeWorkspaceId,
      notificationsLastSeenAt: state.notificationsLastSeenAt,
      toggleSidebarCollapsed,
      setSidebarCollapsed,
      addRecentBoard,
      setActiveWorkspace,
      markNotificationsSeen,
    }),
    [
      state.sidebarCollapsed,
      state.recentBoardIds,
      state.activeWorkspaceId,
      state.notificationsLastSeenAt,
      toggleSidebarCollapsed,
      setSidebarCollapsed,
      addRecentBoard,
      setActiveWorkspace,
      markNotificationsSeen,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
