import { useState, useRef } from "react";
import { Modal } from "../modal/Modal";
import { useData } from "../../contexts/DataContext";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./CreateWorkspaceModal.module.css";

export function CreateWorkspaceModal({ isOpen, onClose, onCreated }) {
  const { createWorkspace } = useData();
  const [name, setName] = useState("");
  const [colorId, setColorId] = useState(LABEL_COLORS[0].id);
  const nameInputRef = useRef(null);

  function handleClose() {
    setName("");
    setColorId(LABEL_COLORS[0].id);
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = LABEL_COLORS.find((c) => c.id === colorId).value;
    const id = createWorkspace(trimmed, { color });
    onCreated(id);
    handleClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create workspace"
      size="sm"
      initialFocusRef={nameInputRef}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Workspace name</span>
          <input
            ref={nameInputRef}
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Marketing Team"
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
                onClick={() => setColorId(color.id)}
                aria-label={color.name}
                aria-pressed={colorId === color.id}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={!name.trim()}>
            Create workspace
          </button>
        </div>
      </form>
    </Modal>
  );
}
