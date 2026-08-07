export const EMPTY_FILTERS = {
  memberIds: [],
  labelIds: [],
  priorities: [],
  dueDate: null,
  completion: null,
};

export function countActiveFilters(filters) {
  return (
    filters.memberIds.length +
    filters.labelIds.length +
    filters.priorities.length +
    (filters.dueDate ? 1 : 0) +
    (filters.completion ? 1 : 0)
  );
}
