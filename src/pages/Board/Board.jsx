import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { Star, Archive, ArchiveRestore, Trash2, Lock, Users, Inbox, Tag } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useUI } from "../../contexts/UIContext";
import { EmptyState } from "../../components/common/EmptyState";
import { EditableHeading } from "../../components/common/EditableHeading";
import { ConfirmDialog } from "../../components/modal/ConfirmDialog";
import { ListColumn } from "../../components/list/ListColumn";
import { AddListComposer } from "../../components/list/AddListComposer";
import { ArchivedListsPanel } from "../../components/list/ArchivedListsPanel";
import { CardDetailModal } from "../../components/card/CardDetailModal";
import { ArchivedCardsPanel } from "../../components/card/ArchivedCardsPanel";
import { CardTile } from "../../components/card/CardTile";
import { LabelManagerModal } from "../../components/label/LabelManagerModal";
import { FilterPanel } from "../../components/filter/FilterPanel";
import { EMPTY_FILTERS, countActiveFilters } from "../../constants/filters";
import { cardMatchesFilters } from "../../utils/cardFilters";
import { LABEL_COLORS } from "../../constants/labelColors";
import { ROUTES } from "../../constants/routes";
import styles from "./Board.module.css";

export default function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    boards,
    projects,
    workspaces,
    lists,
    cards,
    labels,
    members,
    updateBoard,
    deleteBoard,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    batchUpdate,
  } = useData();
  const { addRecentBoard } = useUI();
  const [openCardId, setOpenCardId] = useState(null);
  const [archivedCardsOpen, setArchivedCardsOpen] = useState(false);
  const [activeDrag, setActiveDrag] = useState(null);
  const [dragCardIdsByList, setDragCardIdsByList] = useState(null);
  const addListComposerRef = useRef(null);
  const firstListRef = useRef(null);

  const board = boards.byId[boardId];
  const project = board ? projects.byId[board.projectId] : null;
  const workspace = project ? workspaces.byId[project.workspaceId] : null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archivedListsOpen, setArchivedListsOpen] = useState(false);
  const [labelManagerOpen, setLabelManagerOpen] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    if (board) addRecentBoard(board.id);
  }, [board, addRecentBoard]);

  // Lets Search (and anywhere else) deep-link straight to a card: navigate
  // here with { state: { openCardId } }. Applying it is derived at render
  // time (React docs: "Adjusting state when a prop changes") rather than in
  // an effect; a separate effect then clears the router state so
  // back/forward navigation doesn't reopen it unexpectedly.
  const incomingCardId = location.state?.openCardId ?? null;
  const [lastHandledCardId, setLastHandledCardId] = useState(null);
  if (incomingCardId && incomingCardId !== lastHandledCardId) {
    setLastHandledCardId(incomingCardId);
    setOpenCardId(incomingCardId);
  }

  useEffect(() => {
    if (location.state?.openCardId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Board-scoped shortcuts: "L" opens the add-list composer, "N" opens the
  // first list's add-card composer. Ignored while typing anywhere, or while
  // a modal is already open, so they never hijack normal text entry.
  const anyModalOpen =
    deleteDialogOpen || archivedListsOpen || labelManagerOpen || archivedCardsOpen || Boolean(openCardId);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (isTyping || anyModalOpen) return;

      if (event.key === "l" || event.key === "L") {
        event.preventDefault();
        addListComposerRef.current?.open();
      } else if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        firstListRef.current?.openAddCard();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [anyModalOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const boardListIds = useMemo(
    () =>
      board
        ? lists.allIds
            .filter((id) => lists.byId[id].boardId === board.id && !lists.byId[id].archived)
            .sort((a, b) => lists.byId[a].position - lists.byId[b].position)
        : [],
    [board, lists],
  );

  const archivedLists = useMemo(
    () =>
      board
        ? lists.allIds
            .filter((id) => lists.byId[id].boardId === board.id && lists.byId[id].archived)
            .map((id) => lists.byId[id])
        : [],
    [board, lists],
  );

  const boardLabels = useMemo(
    () =>
      board
        ? labels.allIds.filter((id) => labels.byId[id].boardId === board.id).map((id) => labels.byId[id])
        : [],
    [board, labels],
  );

  const boardMembers = useMemo(() => {
    if (!workspace) return [];
    return workspace.memberIds.map((id) => members.byId[id]).filter(Boolean);
  }, [workspace, members]);

  const cardIdsByList = useMemo(() => {
    const map = {};
    for (const id of boardListIds) {
      map[id] = cards.allIds
        .filter((cardId) => {
          const card = cards.byId[cardId];
          if (card.listId !== id || card.archived) return false;
          return cardMatchesFilters(card, filters);
        })
        .sort((a, b) => cards.byId[a].position - cards.byId[b].position);
    }
    return map;
  }, [boardListIds, cards, filters]);

  // While a card drag is in progress, this local mirror reflects the live
  // cross-list preview so the DataContext isn't written to on every pixel of
  // pointer movement — only once, on drop.
  const displayCardIdsByList = dragCardIdsByList ?? cardIdsByList;

  const archivedCards = useMemo(
    () =>
      cards.allIds
        .filter((id) => boardListIds.includes(cards.byId[id].listId) && cards.byId[id].archived)
        .map((id) => cards.byId[id]),
    [cards, boardListIds],
  );

  const handleRename = useCallback((name) => updateBoard(board.id, { name }), [board, updateBoard]);

  const handleToggleFavorite = useCallback(() => {
    updateBoard(board.id, { favorite: !board.favorite });
  }, [board, updateBoard]);

  const handleToggleArchive = useCallback(() => {
    updateBoard(board.id, { archived: !board.archived });
  }, [board, updateBoard]);

  const handleSetVisibility = useCallback(
    (visibility) => updateBoard(board.id, { visibility }),
    [board, updateBoard],
  );

  const handleSetBackground = useCallback(
    (background) => updateBoard(board.id, { background }),
    [board, updateBoard],
  );

  const handleDelete = useCallback(() => {
    deleteBoard(board.id);
    navigate(project ? ROUTES.project(workspace.id, project.id) : ROUTES.dashboard());
  }, [board, project, workspace, deleteBoard, navigate]);

  const handleCreateList = useCallback(
    (name) => createList(board.id, name),
    [board, createList],
  );

  const handleRenameList = useCallback((listId, name) => updateList(listId, { name }), [updateList]);

  const handleToggleListCollapse = useCallback(
    (listId, collapsed) => updateList(listId, { collapsed }),
    [updateList],
  );

  const handleArchiveList = useCallback((listId) => updateList(listId, { archived: true }), [updateList]);

  const handleRestoreList = useCallback((listId) => updateList(listId, { archived: false }), [updateList]);

  const handleCreateCard = useCallback((listId, title) => createCard(listId, title), [createCard]);

  const handleOpenCard = useCallback((cardId) => setOpenCardId(cardId), []);

  const handleRestoreCard = useCallback((cardId) => updateCard(cardId, { archived: false }), [updateCard]);

  const handleClearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      const type = active.data.current?.type;
      setActiveDrag({ type, id: active.id });
      if (type === "card") {
        const clone = {};
        for (const listId of boardListIds) clone[listId] = [...cardIdsByList[listId]];
        setDragCardIdsByList(clone);
      }
    },
    [boardListIds, cardIdsByList],
  );

  const handleDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.data.current?.type !== "card") return;

      const activeListId = active.data.current.listId;
      const overData = over.data.current;
      const overListId = overData?.type === "card" ? overData.listId : overData?.listId ?? over.id;
      if (!overListId || overListId === activeListId) return;

      setDragCardIdsByList((prev) => {
        if (!prev || !prev[activeListId]?.includes(active.id)) return prev;
        const next = { ...prev };
        next[activeListId] = next[activeListId].filter((id) => id !== active.id);
        const overItems = next[overListId] ?? [];
        const overIndex = overItems.indexOf(over.id);
        const insertAt = overIndex >= 0 ? overIndex : overItems.length;
        next[overListId] = [...overItems.slice(0, insertAt), active.id, ...overItems.slice(insertAt)];
        return next;
      });
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      const type = active.data.current?.type;
      setActiveDrag(null);

      if (!over) {
        setDragCardIdsByList(null);
        return;
      }

      if (type === "list") {
        if (active.id !== over.id) {
          const oldIndex = boardListIds.indexOf(active.id);
          const newIndex = boardListIds.indexOf(over.id);
          const reordered = arrayMove(boardListIds, oldIndex, newIndex);
          batchUpdate(
            "lists",
            reordered.map((id, index) => ({ id, changes: { position: index } })),
          );
        }
        return;
      }

      // Card drag: finalize position (and listId, if it changed lists).
      const activeListId = active.data.current.listId;
      const overData = over.data.current;
      const overListId = overData?.type === "card" ? overData.listId : overData?.listId ?? over.id;

      let finalByList = dragCardIdsByList ?? cardIdsByList;
      if (activeListId === overListId) {
        const items = finalByList[overListId] ?? [];
        const oldIndex = items.indexOf(active.id);
        const newIndex = overData?.type === "card" ? items.indexOf(over.id) : items.length - 1;
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          finalByList = { ...finalByList, [overListId]: arrayMove(items, oldIndex, newIndex) };
        }
      }

      const updates = [];
      const affectedLists = activeListId === overListId ? [overListId] : [activeListId, overListId];
      for (const listId of affectedLists) {
        (finalByList[listId] ?? []).forEach((id, index) => {
          const changes = { position: index };
          if (id === active.id && listId !== activeListId) changes.listId = listId;
          updates.push({ id, changes });
        });
      }
      if (updates.length > 0) batchUpdate("cards", updates);

      setDragCardIdsByList(null);
    },
    [boardListIds, cardIdsByList, dragCardIdsByList, batchUpdate],
  );

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
    setDragCardIdsByList(null);
  }, []);

  if (!board || !project || !workspace) {
    return <EmptyState title="Board not found" description="It may have been deleted." />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <Link to={ROUTES.project(workspace.id, project.id)} className={styles.breadcrumb}>
          &larr; {workspace.name} / {project.name}
        </Link>

        <header className={styles.header}>
          <div className={styles.titleArea}>
            <EditableHeading value={board.name} onSave={handleRename} />
            <div className={styles.meta}>
              <button
                type="button"
                className={styles.visibilityBadge}
                onClick={() =>
                  handleSetVisibility(board.visibility === "private" ? "workspace" : "private")
                }
                title="Click to toggle visibility"
              >
                {board.visibility === "private" ? (
                  <Lock aria-hidden="true" />
                ) : (
                  <Users aria-hidden="true" />
                )}
                {board.visibility === "private" ? "Private" : "Workspace"}
              </button>
              {board.archived && <span className={styles.archivedBadge}>Archived</span>}
            </div>
          </div>

          <button
            className={styles.favoriteButton}
            onClick={handleToggleFavorite}
            aria-pressed={board.favorite}
            aria-label={board.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star fill={board.favorite ? "currentColor" : "none"} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.archiveButton}
            onClick={handleToggleArchive}
            aria-pressed={board.archived}
          >
            {board.archived ? (
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
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Background</h2>
            <div className={styles.archivedButtons}>
              <button
                type="button"
                className={styles.archivedListsButton}
                onClick={() => setLabelManagerOpen(true)}
              >
                <Tag aria-hidden="true" />
                Labels{boardLabels.length > 0 ? ` (${boardLabels.length})` : ""}
              </button>
              <FilterPanel
                boardLabels={boardLabels}
                boardMembers={boardMembers}
                filters={filters}
                onChange={setFilters}
                onClear={handleClearFilters}
              />
              <button
                type="button"
                className={styles.archivedListsButton}
                onClick={() => setArchivedListsOpen(true)}
              >
                <Inbox aria-hidden="true" />
                Archived lists{archivedLists.length > 0 ? ` (${archivedLists.length})` : ""}
              </button>
              <button
                type="button"
                className={styles.archivedListsButton}
                onClick={() => setArchivedCardsOpen(true)}
              >
                <Inbox aria-hidden="true" />
                Archived cards{archivedCards.length > 0 ? ` (${archivedCards.length})` : ""}
              </button>
            </div>
          </div>
          <div className={styles.swatches}>
            {LABEL_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={styles.swatch}
                style={{ background: color.value }}
                onClick={() => handleSetBackground(color.value)}
                aria-label={color.name}
                aria-pressed={board.background === color.value}
              />
            ))}
          </div>
        </section>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <section className={styles.boardArea} style={{ background: board.background }}>
          <SortableContext items={boardListIds} strategy={horizontalListSortingStrategy}>
            {boardListIds.map((id, index) => (
              <ListColumn
                key={id}
                ref={index === 0 ? firstListRef : undefined}
                list={lists.byId[id]}
                cardIds={displayCardIdsByList[id]}
                onRename={(name) => handleRenameList(id, name)}
                onToggleCollapse={() => handleToggleListCollapse(id, !lists.byId[id].collapsed)}
                onArchive={() => handleArchiveList(id)}
                onDelete={() => deleteList(id)}
                onOpenCard={handleOpenCard}
                onCreateCard={(title) => handleCreateCard(id, title)}
                cardDragDisabled={countActiveFilters(filters) > 0}
              />
            ))}
          </SortableContext>
          <AddListComposer ref={addListComposerRef} onCreate={handleCreateList} />
        </section>

        <DragOverlay>
          {activeDrag?.type === "card" && (
            <div className={styles.cardOverlay}>
              <CardTile cardId={activeDrag.id} onOpen={() => {}} />
            </div>
          )}
          {activeDrag?.type === "list" && (
            <div className={styles.listOverlay}>{lists.byId[activeDrag.id]?.name}</div>
          )}
        </DragOverlay>
      </DndContext>

      <div className={styles.pageInner}>
        <section className={styles.dangerZone}>
          <div>
            <h2 className={styles.sectionTitle}>Delete this board</h2>
            <p className={styles.dangerDescription}>
              Permanently deletes this board and all of its lists and cards. This can&rsquo;t be
              undone.
            </p>
          </div>
          <button className={styles.deleteButton} onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 aria-hidden="true" />
            Delete board
          </button>
        </section>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete board?"
        description={`This will permanently delete "${board.name}" and all of its lists and cards.`}
        confirmLabel="Delete board"
        danger
      />

      <LabelManagerModal
        isOpen={labelManagerOpen}
        onClose={() => setLabelManagerOpen(false)}
        boardId={board.id}
        boardLabels={boardLabels}
      />

      <ArchivedListsPanel
        isOpen={archivedListsOpen}
        onClose={() => setArchivedListsOpen(false)}
        lists={archivedLists}
        onRestore={handleRestoreList}
        onDeletePermanently={deleteList}
      />

      <ArchivedCardsPanel
        isOpen={archivedCardsOpen}
        onClose={() => setArchivedCardsOpen(false)}
        cards={archivedCards}
        onRestore={handleRestoreCard}
        onDeletePermanently={deleteCard}
        onOpen={(cardId) => {
          setArchivedCardsOpen(false);
          setOpenCardId(cardId);
        }}
      />

      <CardDetailModal cardId={openCardId} onClose={() => setOpenCardId(null)} />
    </div>
  );
}
