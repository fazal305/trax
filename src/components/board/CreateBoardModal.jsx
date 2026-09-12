import { useState, useRef } from "react";
import { Lock, Users } from "lucide-react";
import { Modal } from "../modal/Modal";
import { useData } from "../../contexts/DataContext";
import { useToast } from "../../contexts/ToastContext";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./CreateBoardModal.module.css";

export function CreateBoardModal({ isOpen, onClose, projectId, onCreated }) {
  const { createBoard } = useData();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [colorId, setColorId] = useState(LABEL_COLORS[0].id);
  const [visibility, setVisibility] = useState("private");
  const nameInputRef = useRef(null);

  function handleClose() {
    setName("");
    setColorId(LABEL_COLORS[0].id);
    setVisibility("private");
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const background = LABEL_COLORS.find((c) => c.id === colorId).value;
    const id = createBoard(projectId, trimmed, { background, visibility });
    onCreated(id);
    handleClose();
    showToast(`Board "${trimmed}" created.`);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create board"
      size="sm"
      initialFocusRef={nameInputRef}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Board name</span>
          <input
            ref={nameInputRef}
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Sprint 12"
            required
          />
        </label>

        <fieldset className={styles.field}>
          <legend className={styles.label}>Background</legend>
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

        <fieldset className={styles.field}>
          <legend className={styles.label}>Visibility</legend>
          <div className={styles.visibilityOptions}>
            <button
              type="button"
              className={styles.visibilityOption}
              onClick={() => setVisibility("private")}
              aria-pressed={visibility === "private"}
            >
              <Lock aria-hidden="true" />
              Private
            </button>
            <button
              type="button"
              className={styles.visibilityOption}
              onClick={() => setVisibility("workspace")}
              aria-pressed={visibility === "workspace"}
            >
              <Users aria-hidden="true" />
              Workspace
            </button>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={!name.trim()}>
            Create board
          </button>
        </div>
      </form>
    </Modal>
  );
}
