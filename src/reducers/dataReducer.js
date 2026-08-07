import { generateId } from "../utils/id";

export const DATA_ACTIONS = {
  WORKSPACE_CREATE: "data/workspaceCreate",
  WORKSPACE_UPDATE: "data/workspaceUpdate",
  WORKSPACE_DELETE: "data/workspaceDelete",

  PROJECT_CREATE: "data/projectCreate",
  PROJECT_UPDATE: "data/projectUpdate",
  PROJECT_DELETE: "data/projectDelete",

  BOARD_CREATE: "data/boardCreate",
  BOARD_UPDATE: "data/boardUpdate",
  BOARD_DELETE: "data/boardDelete",

  LIST_CREATE: "data/listCreate",
  LIST_UPDATE: "data/listUpdate",
  LIST_DELETE: "data/listDelete",

  CARD_CREATE: "data/cardCreate",
  CARD_UPDATE: "data/cardUpdate",
  CARD_DELETE: "data/cardDelete",
  CARD_DUPLICATE: "data/cardDuplicate",

  LABEL_CREATE: "data/labelCreate",
  LABEL_UPDATE: "data/labelUpdate",
  LABEL_DELETE: "data/labelDelete",

  MEMBER_UPDATE: "data/memberUpdate",

  ACTIVITY_ADD: "data/activityAdd",

  // Applies many { id, changes } patches to one entity slice in a single
  // state update — used by drag-and-drop to commit a whole reorder/move
  // (multiple cards' listId + position) atomically instead of one dispatch
  // per card.
  BATCH_UPDATE: "data/batchUpdate",
};

// -- Generic helpers for a normalized { byId, allIds } slice --------------

function insertEntity(slice, entity) {
  return {
    byId: { ...slice.byId, [entity.id]: entity },
    allIds: [...slice.allIds, entity.id],
  };
}

function updateEntity(slice, id, changes) {
  if (!slice.byId[id]) return slice;
  return {
    ...slice,
    byId: { ...slice.byId, [id]: { ...slice.byId[id], ...changes } },
  };
}

function removeEntities(slice, ids) {
  const idSet = new Set(ids);
  const byId = { ...slice.byId };
  for (const id of idSet) delete byId[id];
  return {
    byId,
    allIds: slice.allIds.filter((id) => !idSet.has(id)),
  };
}

function idsWhere(slice, predicate) {
  return slice.allIds.filter((id) => predicate(slice.byId[id]));
}

export function dataReducer(state, action) {
  switch (action.type) {
    case DATA_ACTIONS.WORKSPACE_CREATE: {
      const workspace = {
        id: action.payload.id,
        name: action.payload.name,
        color: action.payload.color ?? "var(--color-brand)",
        favorite: false,
        memberIds: action.payload.memberIds ?? [],
        createdAt: new Date().toISOString(),
      };
      return { ...state, workspaces: insertEntity(state.workspaces, workspace) };
    }

    case DATA_ACTIONS.WORKSPACE_UPDATE:
      return {
        ...state,
        workspaces: updateEntity(state.workspaces, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.WORKSPACE_DELETE: {
      const workspaceId = action.payload.id;
      const projectIds = idsWhere(state.projects, (p) => p.workspaceId === workspaceId);
      const boardIds = idsWhere(state.boards, (b) => projectIds.includes(b.projectId));
      const listIds = idsWhere(state.lists, (l) => boardIds.includes(l.boardId));
      const cardIds = idsWhere(state.cards, (c) => listIds.includes(c.listId));
      const activityIds = idsWhere(state.activity, (a) => cardIds.includes(a.cardId));
      const labelIds = idsWhere(state.labels, (l) => boardIds.includes(l.boardId));

      return {
        ...state,
        workspaces: removeEntities(state.workspaces, [workspaceId]),
        projects: removeEntities(state.projects, projectIds),
        boards: removeEntities(state.boards, boardIds),
        lists: removeEntities(state.lists, listIds),
        cards: removeEntities(state.cards, cardIds),
        activity: removeEntities(state.activity, activityIds),
        labels: removeEntities(state.labels, labelIds),
      };
    }

    case DATA_ACTIONS.PROJECT_CREATE: {
      const project = {
        id: action.payload.id,
        workspaceId: action.payload.workspaceId,
        name: action.payload.name,
        description: action.payload.description ?? "",
        color: action.payload.color ?? "var(--label-blue)",
        archived: false,
        createdAt: new Date().toISOString(),
      };
      return { ...state, projects: insertEntity(state.projects, project) };
    }

    case DATA_ACTIONS.PROJECT_UPDATE:
      return {
        ...state,
        projects: updateEntity(state.projects, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.PROJECT_DELETE: {
      const projectId = action.payload.id;
      const boardIds = idsWhere(state.boards, (b) => b.projectId === projectId);
      const listIds = idsWhere(state.lists, (l) => boardIds.includes(l.boardId));
      const cardIds = idsWhere(state.cards, (c) => listIds.includes(c.listId));
      const activityIds = idsWhere(state.activity, (a) => cardIds.includes(a.cardId));
      const labelIds = idsWhere(state.labels, (l) => boardIds.includes(l.boardId));

      return {
        ...state,
        projects: removeEntities(state.projects, [projectId]),
        boards: removeEntities(state.boards, boardIds),
        lists: removeEntities(state.lists, listIds),
        cards: removeEntities(state.cards, cardIds),
        activity: removeEntities(state.activity, activityIds),
        labels: removeEntities(state.labels, labelIds),
      };
    }

    case DATA_ACTIONS.BOARD_CREATE: {
      const board = {
        id: action.payload.id,
        projectId: action.payload.projectId,
        name: action.payload.name,
        background: action.payload.background ?? "var(--color-brand)",
        visibility: action.payload.visibility ?? "private",
        favorite: false,
        archived: false,
        createdAt: new Date().toISOString(),
      };
      return { ...state, boards: insertEntity(state.boards, board) };
    }

    case DATA_ACTIONS.BOARD_UPDATE:
      return {
        ...state,
        boards: updateEntity(state.boards, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.BOARD_DELETE: {
      const boardId = action.payload.id;
      const listIds = idsWhere(state.lists, (l) => l.boardId === boardId);
      const cardIds = idsWhere(state.cards, (c) => listIds.includes(c.listId));
      const activityIds = idsWhere(state.activity, (a) => cardIds.includes(a.cardId));
      const labelIds = idsWhere(state.labels, (l) => l.boardId === boardId);

      return {
        ...state,
        boards: removeEntities(state.boards, [boardId]),
        lists: removeEntities(state.lists, listIds),
        cards: removeEntities(state.cards, cardIds),
        activity: removeEntities(state.activity, activityIds),
        labels: removeEntities(state.labels, labelIds),
      };
    }

    case DATA_ACTIONS.LIST_CREATE: {
      const boardListCount = idsWhere(state.lists, (l) => l.boardId === action.payload.boardId).length;
      const list = {
        id: action.payload.id,
        boardId: action.payload.boardId,
        name: action.payload.name,
        position: boardListCount,
        collapsed: false,
        archived: false,
      };
      return { ...state, lists: insertEntity(state.lists, list) };
    }

    case DATA_ACTIONS.LIST_UPDATE:
      return {
        ...state,
        lists: updateEntity(state.lists, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.LIST_DELETE: {
      const listId = action.payload.id;
      const cardIds = idsWhere(state.cards, (c) => c.listId === listId);
      const activityIds = idsWhere(state.activity, (a) => cardIds.includes(a.cardId));

      return {
        ...state,
        lists: removeEntities(state.lists, [listId]),
        cards: removeEntities(state.cards, cardIds),
        activity: removeEntities(state.activity, activityIds),
      };
    }

    case DATA_ACTIONS.CARD_CREATE: {
      const listCardCount = idsWhere(state.cards, (c) => c.listId === action.payload.listId).length;
      const card = {
        id: action.payload.id,
        listId: action.payload.listId,
        title: action.payload.title,
        description: "",
        dueDate: null,
        priority: "none",
        labelIds: [],
        memberIds: [],
        checklist: [],
        attachments: [],
        coverColor: null,
        archived: false,
        position: listCardCount,
        createdAt: new Date().toISOString(),
      };
      return { ...state, cards: insertEntity(state.cards, card) };
    }

    case DATA_ACTIONS.CARD_UPDATE:
      return {
        ...state,
        cards: updateEntity(state.cards, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.CARD_DELETE: {
      const cardId = action.payload.id;
      const activityIds = idsWhere(state.activity, (a) => a.cardId === cardId);

      return {
        ...state,
        cards: removeEntities(state.cards, [cardId]),
        activity: removeEntities(state.activity, activityIds),
      };
    }

    case DATA_ACTIONS.CARD_DUPLICATE: {
      const original = state.cards.byId[action.payload.sourceId];
      if (!original) return state;
      const listCardCount = idsWhere(state.cards, (c) => c.listId === original.listId).length;
      const duplicate = {
        ...original,
        id: action.payload.newId,
        title: `${original.title} (copy)`,
        checklist: original.checklist.map((item) => ({ ...item, id: generateId() })),
        position: listCardCount,
        createdAt: new Date().toISOString(),
      };
      return { ...state, cards: insertEntity(state.cards, duplicate) };
    }

    case DATA_ACTIONS.LABEL_CREATE: {
      const label = {
        id: action.payload.id,
        boardId: action.payload.boardId,
        name: action.payload.name,
        color: action.payload.color,
      };
      return { ...state, labels: insertEntity(state.labels, label) };
    }

    case DATA_ACTIONS.LABEL_UPDATE:
      return {
        ...state,
        labels: updateEntity(state.labels, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.LABEL_DELETE: {
      const labelId = action.payload.id;
      const affectedCardIds = idsWhere(state.cards, (c) => c.labelIds.includes(labelId));
      let cardsSlice = state.cards;
      for (const cardId of affectedCardIds) {
        cardsSlice = updateEntity(cardsSlice, cardId, {
          labelIds: cardsSlice.byId[cardId].labelIds.filter((id) => id !== labelId),
        });
      }

      return {
        ...state,
        labels: removeEntities(state.labels, [labelId]),
        cards: cardsSlice,
      };
    }

    case DATA_ACTIONS.MEMBER_UPDATE:
      return {
        ...state,
        members: updateEntity(state.members, action.payload.id, action.payload.changes),
      };

    case DATA_ACTIONS.ACTIVITY_ADD: {
      const entry = {
        id: action.payload.id,
        cardId: action.payload.cardId,
        type: action.payload.entryType,
        actorId: action.payload.actorId,
        createdAt: new Date().toISOString(),
        ...(action.payload.entryType === "comment"
          ? { text: action.payload.text }
          : { message: action.payload.message }),
      };
      return { ...state, activity: insertEntity(state.activity, entry) };
    }

    case DATA_ACTIONS.BATCH_UPDATE: {
      const { entity, updates } = action.payload;
      let slice = state[entity];
      for (const { id, changes } of updates) {
        slice = updateEntity(slice, id, changes);
      }
      return { ...state, [entity]: slice };
    }

    default:
      return state;
  }
}
