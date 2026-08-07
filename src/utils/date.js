import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from "date-fns";

export function formatDueDate(isoDate) {
  const date = new Date(isoDate);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}

export function isOverdue(isoDate) {
  return isPast(new Date(isoDate)) && !isToday(new Date(isoDate));
}

export function formatRelativeTime(isoDate) {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
}
