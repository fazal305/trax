import { useState, useRef, useCallback } from "react";
import { Image } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { LABEL_COLORS } from "../../constants/labelColors";
import styles from "./CoverColorPicker.module.css";

export function CoverColorPicker({ coverColor, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  return (
    <div className={styles.container} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        <Image aria-hidden="true" />
        Cover
      </button>

      {open && (
        <div className={styles.menu}>
          <div className={styles.swatches}>
            {LABEL_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={styles.swatch}
                style={{ background: color.value }}
                onClick={() => onChange(color.value)}
                aria-label={color.name}
                aria-pressed={coverColor === color.value}
              />
            ))}
          </div>
          {coverColor && (
            <button type="button" className={styles.clearButton} onClick={() => onChange(null)}>
              Remove cover
            </button>
          )}
        </div>
      )}
    </div>
  );
}
