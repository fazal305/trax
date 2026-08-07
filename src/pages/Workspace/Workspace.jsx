import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Plus, X as XIcon, Trash2, Layers } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useUI } from "../../contexts/UIContext";
import { MemberAvatar } from "../../components/common/MemberAvatar";
import { EmptyState } from "../../components/common/EmptyState";
import { EditableHeading } from "../../components/common/EditableHeading";
import { SearchInput } from "../../components/common/SearchInput";
import { ConfirmDialog } from "../../components/modal/ConfirmDialog";
import { ProjectCard } from "../../components/project/ProjectCard";
import { CreateProjectModal } from "../../components/project/CreateProjectModal";
import { EditMemberModal } from "../../components/workspace/EditMemberModal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { ROUTES } from "../../constants/routes";
import styles from "./Workspace.module.css";

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projects, boards, members, updateWorkspace, updateProject, deleteWorkspace } =
    useData();
  const { setActiveWorkspace } = useUI();

  const workspace = workspaces.byId[workspaceId];

  // Keep the sidebar switcher's active workspace in sync when a workspace
  // is opened directly via URL/back-forward, not only via the switcher.
  useEffect(() => {
    if (workspace) setActiveWorkspace(workspaceId);
  }, [workspaceId, workspace, setActiveWorkspace]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const addMemberRef = useRef(null);
  useOnClickOutside(addMemberRef, useCallback(() => setAddMemberOpen(false), []));

  const workspaceProjectIds = useMemo(
    () =>
      workspace ? projects.allIds.filter((id) => projects.byId[id].workspaceId === workspace.id) : [],
    [projects, workspace],
  );

  const visibleProjectIds = useMemo(() => {
    const query = projectQuery.trim().toLowerCase();
    return workspaceProjectIds.filter((id) => {
      const project = projects.byId[id];
      if (!showArchivedProjects && project.archived) return false;
      if (query && !project.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [workspaceProjectIds, projects, projectQuery, showArchivedProjects]);

  const boardCountByProject = useMemo(() => {
    const counts = {};
    for (const projectId of workspaceProjectIds) {
      counts[projectId] = boards.allIds.filter((id) => boards.byId[id].projectId === projectId).length;
    }
    return counts;
  }, [boards, workspaceProjectIds]);

  const workspaceMembers = useMemo(
    () => (workspace ? workspace.memberIds.map((id) => members.byId[id]).filter(Boolean) : []),
    [workspace, members],
  );

  const availableMembers = useMemo(
    () =>
      workspace
        ? members.allIds.filter((id) => !workspace.memberIds.includes(id)).map((id) => members.byId[id])
        : [],
    [workspace, members],
  );

  const handleRenameWorkspace = useCallback(
    (name) => updateWorkspace(workspace.id, { name }),
    [workspace, updateWorkspace],
  );

  const handleToggleFavorite = useCallback(() => {
    updateWorkspace(workspace.id, { favorite: !workspace.favorite });
  }, [workspace, updateWorkspace]);

  const handleRemoveMember = useCallback(
    (memberId) => {
      updateWorkspace(workspace.id, {
        memberIds: workspace.memberIds.filter((id) => id !== memberId),
      });
    },
    [workspace, updateWorkspace],
  );

  const handleAddMember = useCallback(
    (memberId) => {
      updateWorkspace(workspace.id, { memberIds: [...workspace.memberIds, memberId] });
      setAddMemberOpen(false);
    },
    [workspace, updateWorkspace],
  );

  const handleToggleProjectArchive = useCallback(
    (projectId, archived) => updateProject(projectId, { archived }),
    [updateProject],
  );

  const handleDelete = useCallback(() => {
    deleteWorkspace(workspace.id);
    navigate(ROUTES.dashboard());
  }, [workspace, deleteWorkspace, navigate]);

  if (!workspace) {
    return <EmptyState title="Workspace not found" description="It may have been deleted." />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.avatar} style={{ background: workspace.color }} aria-hidden="true">
          {workspace.name.charAt(0).toUpperCase()}
        </span>

        <div className={styles.titleArea}>
          <EditableHeading value={workspace.name} onSave={handleRenameWorkspace} />
          <span className={styles.meta}>
            {workspaceProjectIds.length} project{workspaceProjectIds.length === 1 ? "" : "s"}
          </span>
        </div>

        <button
          className={styles.favoriteButton}
          onClick={handleToggleFavorite}
          aria-pressed={workspace.favorite}
          aria-label={workspace.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star fill={workspace.favorite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Members</h2>
        <div className={styles.memberList}>
          {workspaceMembers.map((member) => (
            <div key={member.id} className={styles.memberRow}>
              <button
                type="button"
                className={styles.memberEditButton}
                onClick={() => setEditingMemberId(member.id)}
              >
                <MemberAvatar member={member} size="sm" />
                <span className={styles.memberName}>{member.name}</span>
              </button>
              <span className={styles.memberRole}>{member.role}</span>
              {member.id !== "member-you" && (
                <button
                  className={styles.removeMemberButton}
                  onClick={() => handleRemoveMember(member.id)}
                  aria-label={`Remove ${member.name}`}
                >
                  <XIcon aria-hidden="true" />
                </button>
              )}
            </div>
          ))}

          <div className={styles.addMemberContainer} ref={addMemberRef}>
            <button
              type="button"
              className={styles.addMemberButton}
              onClick={() => setAddMemberOpen((open) => !open)}
            >
              <Plus aria-hidden="true" />
              Add member
            </button>
            {addMemberOpen && (
              <div className={styles.addMemberDropdown} role="listbox">
                {availableMembers.length > 0 ? (
                  availableMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      className={styles.addMemberOption}
                      onClick={() => handleAddMember(member.id)}
                    >
                      <MemberAvatar member={member} size="sm" />
                      {member.name}
                    </button>
                  ))
                ) : (
                  <p className={styles.noMembers}>Everyone is already a member.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.projectToolbar}>
            <SearchInput value={projectQuery} onChange={setProjectQuery} placeholder="Search projects…" />
            <button
              type="button"
              className={styles.archiveToggle}
              onClick={() => setShowArchivedProjects((show) => !show)}
              aria-pressed={showArchivedProjects}
            >
              {showArchivedProjects ? "Hide archived" : "Show archived"}
            </button>
            <button
              type="button"
              className={styles.newProjectButton}
              onClick={() => setCreateProjectOpen(true)}
            >
              <Plus aria-hidden="true" />
              New project
            </button>
          </div>
        </div>

        {visibleProjectIds.length > 0 ? (
          <div className={styles.projectGrid}>
            {visibleProjectIds.map((id) => (
              <ProjectCard
                key={id}
                project={projects.byId[id]}
                boardCount={boardCountByProject[id]}
                onToggleArchive={handleToggleProjectArchive}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title={workspaceProjectIds.length > 0 ? "No matching projects" : "No projects yet"}
            description={
              workspaceProjectIds.length > 0
                ? "Try a different search or show archived projects."
                : "Create your first project to start organizing boards."
            }
          />
        )}
      </section>

      <section className={styles.dangerZone}>
        <div>
          <h2 className={styles.sectionTitle}>Delete this workspace</h2>
          <p className={styles.dangerDescription}>
            Permanently deletes this workspace and everything inside it — projects, boards, lists,
            and cards. This can&rsquo;t be undone.
          </p>
        </div>
        <button className={styles.deleteButton} onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 aria-hidden="true" />
          Delete workspace
        </button>
      </section>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete workspace?"
        description={`This will permanently delete "${workspace.name}" and all of its projects, boards, and cards.`}
        confirmLabel="Delete workspace"
        danger
      />

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        workspaceId={workspace.id}
        onCreated={(projectId) => navigate(ROUTES.project(workspace.id, projectId))}
      />

      <EditMemberModal
        isOpen={Boolean(editingMemberId)}
        onClose={() => setEditingMemberId(null)}
        memberId={editingMemberId}
      />
    </div>
  );
}
