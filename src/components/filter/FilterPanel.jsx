import { useState, useRef, useCallback } from "react";
import { Check, Filter } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { MemberAvatar } from "../common/MemberAvatar";
import { PRIORITIES } from "../../constants/priority";
import { countActiveFilters } from "../../constants/filters";
import styles from "./FilterPanel.module.css";

const DUE_DATE_OPTIONS = [
  { id: "overdue", label: "Overdue" },
  { id: "today", label: "Due today" },
  { id: "week", label: "Due this week" },
  { id: "none", label: "No due date" },
];

const COMPLETION_OPTIONS = [
  { id: "complete", label: "Checklist complete" },
  { id: "incomplete", label: "Checklist incomplete" },
  { id: "none", label: "No checklist" },
];

function ToggleChip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.chipActive}` : styles.chip}
      onClick={onClick}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ boardLabels, boardMembers, filters, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const activeCount = countActiveFilters(filters);

  function toggleInList(key, id) {
    const list = filters[key];
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    onChange({ ...filters, [key]: next });
  }

  function toggleSingle(key, id) {
    onChange({ ...filters, [key]: filters[key] === id ? null : id });
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={activeCount > 0 ? `${styles.trigger} ${styles.active}` : styles.trigger}
        onClick={() => setOpen((o) => !o)}
      >
        <Filter aria-hidden="true" />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className={styles.menu}>
          {boardMembers.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Members</h3>
              <div className={styles.memberList}>
                {boardMembers.map((member) => {
                  const selected = filters.memberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      className={styles.memberOption}
                      aria-pressed={selected}
                      onClick={() => toggleInList("memberIds", member.id)}
                    >
                      <MemberAvatar member={member} size="sm" />
                      <span className={styles.memberName}>{member.name}</span>
                      {selected && <Check className={styles.check} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {boardLabels.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Labels</h3>
              <div className={styles.chipRow}>
                {boardLabels.map((label) => (
                  <ToggleChip
                    key={label.id}
                    selected={filters.labelIds.includes(label.id)}
                    onClick={() => toggleInList("labelIds", label.id)}
                  >
                    <span className={styles.labelDot} style={{ background: label.color }} />
                    {label.name}
                  </ToggleChip>
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Priority</h3>
            <div className={styles.chipRow}>
              {PRIORITIES.filter((p) => p.id !== "none").map((priority) => (
                <ToggleChip
                  key={priority.id}
                  selected={filters.priorities.includes(priority.id)}
                  onClick={() => toggleInList("priorities", priority.id)}
                >
                  {priority.label}
                </ToggleChip>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Due date</h3>
            <div className={styles.chipRow}>
              {DUE_DATE_OPTIONS.map((option) => (
                <ToggleChip
                  key={option.id}
                  selected={filters.dueDate === option.id}
                  onClick={() => toggleSingle("dueDate", option.id)}
                >
                  {option.label}
                </ToggleChip>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Checklist completion</h3>
            <div className={styles.chipRow}>
              {COMPLETION_OPTIONS.map((option) => (
                <ToggleChip
                  key={option.id}
                  selected={filters.completion === option.id}
                  onClick={() => toggleSingle("completion", option.id)}
                >
                  {option.label}
                </ToggleChip>
              ))}
            </div>
          </section>

          {activeCount > 0 && (
            <button type="button" className={styles.clearButton} onClick={onClear}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
