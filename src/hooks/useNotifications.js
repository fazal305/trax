import { useMemo } from "react";
import { isPast, isToday, addDays } from "date-fns";
import { useData } from "../contexts/DataContext";
import { useUser } from "../contexts/UserContext";

// Notifications are computed on the fly from existing data (assignments,
// due dates, @mentions in comments) rather than stored as their own entity
// — there's no server pushing events, so anything "notification-worthy" is
// already sitting in cards/activity and just needs surfacing.
export function useNotifications() {
  const { cards, lists, boards, activity } = useData();
  const { currentUser } = useUser();

  return useMemo(() => {
    const notifications = [];

    for (const cardId of cards.allIds) {
      const card = cards.byId[cardId];
      if (card.archived) continue;
      const list = lists.byId[card.listId];
      const board = list ? boards.byId[list.boardId] : null;
      if (!board) continue;

      if (card.memberIds.includes(currentUser.id) && card.dueDate) {
        const due = new Date(card.dueDate);
        const isOverdue = isPast(due) && !isToday(due);
        const isSoon = !isOverdue && due <= addDays(new Date(), 2);
        if (isOverdue || isSoon) {
          notifications.push({
            id: `due-${card.id}`,
            type: "due",
            message: isOverdue ? "is overdue" : "is due soon",
            card,
            board,
            createdAt: card.dueDate,
          });
        }
      }
    }

    for (const entryId of activity.allIds) {
      const entry = activity.byId[entryId];
      const card = cards.byId[entry.cardId];
      if (!card || card.archived) continue;
      const list = lists.byId[card.listId];
      const board = list ? boards.byId[list.boardId] : null;
      if (!board) continue;

      if (entry.type === "system" && entry.message === `added ${currentUser.name}`) {
        notifications.push({
          id: `assigned-${entry.id}`,
          type: "assigned",
          message: "assigned you to",
          card,
          board,
          createdAt: entry.createdAt,
        });
      }

      if (
        entry.type === "comment" &&
        entry.actorId !== currentUser.id &&
        entry.text.toLowerCase().includes(`@${currentUser.name.toLowerCase()}`)
      ) {
        notifications.push({
          id: `mention-${entry.id}`,
          type: "mention",
          message: "mentioned you on",
          card,
          board,
          createdAt: entry.createdAt,
        });
      }
    }

    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [cards, lists, boards, activity, currentUser]);
}
