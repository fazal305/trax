export const PRIORITIES = [
  { id: "none", label: "None", color: "var(--color-text-tertiary)" },
  { id: "low", label: "Low", color: "var(--color-info)" },
  { id: "medium", label: "Medium", color: "var(--color-warning)" },
  { id: "high", label: "High", color: "var(--color-danger)" },
];

export function getPriority(id) {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];
}
