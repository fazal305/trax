import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { dataReducer, DATA_ACTIONS } from "../reducers/dataReducer";
import { storageService } from "../services/storageService";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { createSeedData } from "../data/seedData";
import { generateId } from "../utils/id";
import { useUser } from "./UserContext";

const DataContext = createContext(null);

function loadInitialState() {
  const stored = storageService.get(STORAGE_KEYS.data, null);
  // Merge over a fresh seed (not replace) so an entity table added after a
  // user's first visit exists for them too, instead of being `undefined`.
  return stored ? { ...createSeedData(), ...stored } : createSeedData();
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, undefined, loadInitialState);
  // Safe: DataProvider is always rendered inside UserProvider (see
  // AppProviders) — used to attribute activity/comment entries to "you".
  const { currentUser } = useUser();

  useEffect(() => {
    storageService.set(STORAGE_KEYS.data, state);
  }, [state]);

  const createWorkspace = useCallback((name, options = {}) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.WORKSPACE_CREATE, payload: { id, name, ...options } });
    return id;
  }, []);

  const updateWorkspace = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.WORKSPACE_UPDATE, payload: { id, changes } });
  }, []);

  const deleteWorkspace = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.WORKSPACE_DELETE, payload: { id } });
  }, []);

  const createProject = useCallback((workspaceId, name, options = {}) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.PROJECT_CREATE, payload: { id, workspaceId, name, ...options } });
    return id;
  }, []);

  const updateProject = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.PROJECT_UPDATE, payload: { id, changes } });
  }, []);

  const deleteProject = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.PROJECT_DELETE, payload: { id } });
  }, []);

  const createBoard = useCallback((projectId, name, options = {}) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.BOARD_CREATE, payload: { id, projectId, name, ...options } });
    return id;
  }, []);

  const updateBoard = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.BOARD_UPDATE, payload: { id, changes } });
  }, []);

  const deleteBoard = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.BOARD_DELETE, payload: { id } });
  }, []);

  const createList = useCallback((boardId, name) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.LIST_CREATE, payload: { id, boardId, name } });
    return id;
  }, []);

  const updateList = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.LIST_UPDATE, payload: { id, changes } });
  }, []);

  const deleteList = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.LIST_DELETE, payload: { id } });
  }, []);

  const createCard = useCallback((listId, title) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.CARD_CREATE, payload: { id, listId, title } });
    return id;
  }, []);

  const updateCard = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.CARD_UPDATE, payload: { id, changes } });
  }, []);

  const deleteCard = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.CARD_DELETE, payload: { id } });
  }, []);

  const duplicateCard = useCallback((sourceId) => {
    const newId = generateId();
    dispatch({ type: DATA_ACTIONS.CARD_DUPLICATE, payload: { sourceId, newId } });
    return newId;
  }, []);

  const addActivity = useCallback(
    (cardId, message) => {
      dispatch({
        type: DATA_ACTIONS.ACTIVITY_ADD,
        payload: { id: generateId(), cardId, entryType: "system", message, actorId: currentUser.id },
      });
    },
    [currentUser.id],
  );

  const addComment = useCallback(
    (cardId, text) => {
      dispatch({
        type: DATA_ACTIONS.ACTIVITY_ADD,
        payload: { id: generateId(), cardId, entryType: "comment", text, actorId: currentUser.id },
      });
    },
    [currentUser.id],
  );

  const batchUpdate = useCallback((entity, updates) => {
    dispatch({ type: DATA_ACTIONS.BATCH_UPDATE, payload: { entity, updates } });
  }, []);

  const createLabel = useCallback((boardId, name, color) => {
    const id = generateId();
    dispatch({ type: DATA_ACTIONS.LABEL_CREATE, payload: { id, boardId, name, color } });
    return id;
  }, []);

  const updateLabel = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.LABEL_UPDATE, payload: { id, changes } });
  }, []);

  const deleteLabel = useCallback((id) => {
    dispatch({ type: DATA_ACTIONS.LABEL_DELETE, payload: { id } });
  }, []);

  const updateMember = useCallback((id, changes) => {
    dispatch({ type: DATA_ACTIONS.MEMBER_UPDATE, payload: { id, changes } });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      createProject,
      updateProject,
      deleteProject,
      createBoard,
      updateBoard,
      deleteBoard,
      createList,
      updateList,
      deleteList,
      createCard,
      updateCard,
      deleteCard,
      duplicateCard,
      addActivity,
      addComment,
      batchUpdate,
      createLabel,
      updateLabel,
      deleteLabel,
      updateMember,
    }),
    [
      state,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      createProject,
      updateProject,
      deleteProject,
      createBoard,
      updateBoard,
      deleteBoard,
      createList,
      updateList,
      deleteList,
      createCard,
      updateCard,
      deleteCard,
      duplicateCard,
      addActivity,
      addComment,
      batchUpdate,
      createLabel,
      updateLabel,
      deleteLabel,
      updateMember,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}
