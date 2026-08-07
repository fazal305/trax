import { useState, useRef, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../modal/Modal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useData } from "../../contexts/DataContext";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./LabelManagerModal.module.css";

function ColorSwatchPicker({ color, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  return (
    <div className={styles.colorPickerContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.colorTrigger}
        style={{ background: color }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Change color"
      />
      {open && (
        <div className={styles.colorMenu}>
          {LABEL_COLORS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.colorOption}
              style={{ background: option.value }}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              aria-label={option.name}
              aria-pressed={color === option.value}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LabelRow({ label, onRename, onRecolor, onDelete }) {
  const [name, setName] = useState(label.name);

  function commit() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== label.name) onRename(trimmed);
    else setName(label.name);
  }

  return (
    <div className={styles.row}>
      <ColorSwatchPicker color={label.color} onChange={onRecolor} />
      <input
        className={styles.nameInput}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
      <button
        type="button"
        className={styles.deleteButton}
        onClick={onDelete}
        aria-label={`Delete ${label.name} label`}
      >
        <Trash2 aria-hidden="true" />
      </button>
    </div>
  );
}

export function LabelManagerModal({ isOpen, onClose, boardId, boardLabels }) {
  const { createLabel, updateLabel, deleteLabel } = useData();
  const [newName, setNewName] = useState("");
  const [newColorId, setNewColorId] = useState(LABEL_COLORS[0].id);

  function handleCreate(event) {
    event.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    const color = LABEL_COLORS.find((c) => c.id === newColorId).value;
    createLabel(boardId, trimmed, color);
    setNewName("");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Labels" size="sm">
      <div className={styles.list}>
        {boardLabels.map((label) => (
          <LabelRow
            key={label.id}
            label={label}
            onRename={(name) => updateLabel(label.id, { name })}
            onRecolor={(color) => updateLabel(label.id, { color })}
            onDelete={() => deleteLabel(label.id)}
          />
        ))}
      </div>

      <form onSubmit={handleCreate} className={styles.createForm}>
        <div className={styles.swatches}>
          {LABEL_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={styles.swatch}
              style={{ background: color.value }}
              onClick={() => setNewColorId(color.id)}
              aria-label={color.name}
              aria-pressed={newColorId === color.id}
            />
          ))}
        </div>
        <div className={styles.createRow}>
          <input
            className={styles.nameInput}
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Create a new label…"
          />
          <button type="submit" className={styles.createButton} disabled={!newName.trim()}>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
