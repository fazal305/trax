import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardTile } from "./CardTile";
import styles from "./SortableCardTile.module.css";

export function SortableCardTile({ cardId, listId, onOpen, dragDisabled = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cardId,
    data: { type: "card", listId },
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? `${styles.wrapper} ${styles.dragging}` : styles.wrapper}
      {...attributes}
      {...listeners}
    >
      <CardTile cardId={cardId} onOpen={onOpen} />
    </div>
  );
}
