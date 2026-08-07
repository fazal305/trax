import { useState, useRef, useCallback } from "react";
import { Check, UserPlus } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { MemberAvatar } from "../common/MemberAvatar";
import styles from "./MemberPicker.module.css";

export function MemberPicker({ candidateMembers, selectedMemberIds, onToggle }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  return (
    <div className={styles.container} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        <UserPlus aria-hidden="true" />
        Members
      </button>

      {open && (
        <div className={styles.menu} role="listbox">
          {candidateMembers.map((member) => {
            const selected = selectedMemberIds.includes(member.id);
            return (
              <button
                key={member.id}
                type="button"
                className={styles.option}
                role="option"
                aria-selected={selected}
                onClick={() => onToggle(member.id, !selected)}
              >
                <MemberAvatar member={member} size="sm" />
                <span className={styles.name}>{member.name}</span>
                {selected && <Check className={styles.check} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
