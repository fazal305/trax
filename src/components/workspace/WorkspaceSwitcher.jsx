import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Star } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useUI } from "../../contexts/UIContext";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { ROUTES } from "../../constants/routes";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import styles from "./WorkspaceSwitcher.module.css";

export function WorkspaceSwitcher({ collapsed }) {
  const { workspaces } = useData();
  const { activeWorkspaceId, setActiveWorkspace } = useUI();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const containerRef = useRef(null);

  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const activeWorkspace = workspaces.byId[activeWorkspaceId] ?? workspaces.byId[workspaces.allIds[0]];

  function goToWorkspace(id) {
    setActiveWorkspace(id);
    navigate(ROUTES.workspace(id));
    setOpen(false);
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={styles.avatar}
          style={{ background: activeWorkspace.color }}
          aria-hidden="true"
        >
          {activeWorkspace.name.charAt(0).toUpperCase()}
        </span>
        {!collapsed && (
          <>
            <span className={styles.name}>{activeWorkspace.name}</span>
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </>
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {workspaces.allIds.map((id) => {
            const workspace = workspaces.byId[id];
            const isActive = id === activeWorkspace.id;
            return (
              <button
                key={id}
                type="button"
                className={isActive ? `${styles.option} ${styles.optionActive}` : styles.option}
                role="option"
                aria-selected={isActive}
                onClick={() => goToWorkspace(id)}
              >
                <span
                  className={styles.optionAvatar}
                  style={{ background: workspace.color }}
                  aria-hidden="true"
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </span>
                <span className={styles.optionName}>{workspace.name}</span>
                {workspace.favorite && (
                  <Star className={styles.favoriteIcon} fill="currentColor" aria-hidden="true" />
                )}
              </button>
            );
          })}
          <button
            type="button"
            className={styles.createButton}
            onClick={() => {
              setOpen(false);
              setCreateModalOpen(true);
            }}
          >
            <Plus className={styles.createIcon} aria-hidden="true" />
            Create workspace
          </button>
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={goToWorkspace}
      />
    </div>
  );
}
