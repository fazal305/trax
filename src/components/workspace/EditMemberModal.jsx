import { useState, useRef } from "react";
import { Modal } from "../modal/Modal";
import { MemberAvatar } from "../common/MemberAvatar";
import { useData } from "../../contexts/DataContext";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./EditMemberModal.module.css";

export function EditMemberModal({ isOpen, onClose, memberId }) {
  const { members, updateMember } = useData();
  const member = memberId ? members.byId[memberId] : null;
  const [name, setName] = useState(member?.name ?? "");
  const nameInputRef = useRef(null);

  // Resync the draft whenever a different member is opened for editing.
  const [editingId, setEditingId] = useState(member?.id ?? null);
  if (member && member.id !== editingId) {
    setEditingId(member.id);
    setName(member.name);
  }

  if (!member) return null;

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed && trimmed !== member.name) updateMember(member.id, { name: trimmed });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit member" size="sm" initialFocusRef={nameInputRef}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.preview}>
          <MemberAvatar member={member} size="lg" />
          <span className={styles.role}>{member.role}</span>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            ref={nameInputRef}
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <fieldset className={styles.field}>
          <legend className={styles.label}>Color</legend>
          <div className={styles.swatches}>
            {LABEL_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={styles.swatch}
                style={{ background: color.value }}
                onClick={() => updateMember(member.id, { color: color.value })}
                aria-label={color.name}
                aria-pressed={member.color === color.value}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
