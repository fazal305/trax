import { isPast, isToday, addDays } from "date-fns";

export function cardMatchesFilters(card, filters) {
  if (filters.memberIds.length > 0 && !card.memberIds.some((id) => filters.memberIds.includes(id))) {
    return false;
  }

  if (filters.labelIds.length > 0 && !card.labelIds.some((id) => filters.labelIds.includes(id))) {
    return false;
  }

  if (filters.priorities.length > 0 && !filters.priorities.includes(card.priority)) {
    return false;
  }

  if (filters.dueDate) {
    if (filters.dueDate === "none" && card.dueDate) return false;
    if (filters.dueDate !== "none" && !card.dueDate) return false;
    if (card.dueDate) {
      const due = new Date(card.dueDate);
      if (filters.dueDate === "overdue" && !(isPast(due) && !isToday(due))) return false;
      if (filters.dueDate === "today" && !isToday(due)) return false;
      if (filters.dueDate === "week" && !(due <= addDays(new Date(), 7) && !isPast(due))) return false;
    }
  }

  if (filters.completion) {
    const hasChecklist = card.checklist.length > 0;
    if (filters.completion === "none" && hasChecklist) return false;
    if (filters.completion !== "none" && !hasChecklist) return false;
    if (hasChecklist) {
      const allDone = card.checklist.every((item) => item.done);
      if (filters.completion === "complete" && !allDone) return false;
      if (filters.completion === "incomplete" && allDone) return false;
    }
  }

  return true;
}
