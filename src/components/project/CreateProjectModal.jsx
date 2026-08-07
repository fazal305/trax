import { useState, useRef } from "react";
import { Modal } from "../modal/Modal";
import { useData } from "../../contexts/DataContext";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./CreateProjectModal.module.css";

export function CreateProjectModal({ isOpen, onClose, workspaceId, onCreated }) {
  const { createProject } = useData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [colorId, setColorId] = useState(LABEL_COLORS[0].id);
  const nameInputRef = useRef(null);

  function handleClose() {
    setName("");
    setDescription("");
    setColorId(LABEL_COLORS[0].id);
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = LABEL_COLORS.find((c) => c.id === colorId).value;
    const id = createProject(workspaceId, trimmed, { description: description.trim(), color });
    onCreated(id);
    handleClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create project"
      size="sm"
      initialFocusRef={nameInputRef}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Project name</span>
          <input
            ref={nameInputRef}
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Website Redesign"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Description (optional)</span>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What's this project for?"
            rows={2}
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
            Create project
          </button>
        </div>
      </form>
    </Modal>
  );
}
