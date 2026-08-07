import { useRef, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditableHeading } from "../common/EditableHeading";
import { ListMenu } from "./ListMenu";
import { SortableCardTile } from "../card/SortableCardTile";
import { AddCardComposer } from "../card/AddCardComposer";
import styles from "./ListColumn.module.css";

export const ListColumn = forwardRef(function ListColumn(
  {
    list,
    cardIds = [],
    onRename,
    onToggleCollapse,
    onArchive,
    onDelete,
    onOpenCard,
    onCreateCard,
    cardDragDisabled = false,
  },
  ref,
) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
    data: { type: "list" },
  });

  // A container droppable in its own right (id = list.id) — necessary so an
  // empty list still accepts a dragged card, since SortableContext alone has
  // no valid drop target when its `items` array is empty.
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list.id,
    data: { type: "list", listId: list.id },
  });

  const addCardComposerRef = useRef(null);

  // Lets the "N" keyboard shortcut (wired in Board.jsx, on the first list
  // only) open this list's add-card composer.
  useImperativeHandle(ref, () => ({
    openAddCard: () => addCardComposerRef.current?.open(),
  }));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (list.collapsed) {
    return (
      <div ref={setNodeRef} style={style} className={styles.collapsedColumn}>
        <button
          type="button"
          className={styles.expandButton}
          onClick={onToggleCollapse}
          aria-label="Expand list"
        >
          <ChevronRight aria-hidden="true" />
        </button>
        <span className={styles.collapsedName}>{list.name}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? `${styles.column} ${styles.dragging}` : styles.column}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.dragHandle}
          aria-label="Drag to reorder list"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={onToggleCollapse}
          aria-label="Collapse list"
        >
          <ChevronDown aria-hidden="true" />
        </button>
        <EditableHeading value={list.name} onSave={onRename} level={3} className={styles.title} />
        <ListMenu onArchive={onArchive} onDelete={onDelete} />
      </div>

      <div className={styles.body} ref={setDroppableRef}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cardIds.map((cardId) => (
            <SortableCardTile
              key={cardId}
              cardId={cardId}
              listId={list.id}
              onOpen={onOpenCard}
              dragDisabled={cardDragDisabled}
            />
          ))}
        </SortableContext>
        <AddCardComposer ref={addCardComposerRef} onCreate={onCreateCard} />
      </div>
    </div>
  );
});
