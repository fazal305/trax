import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Archive, ArchiveRestore, Copy, Trash2, AlignLeft, CheckSquare, Paperclip, History } from "lucide-react";
import { Modal } from "../modal/Modal";
import { ConfirmDialog } from "../modal/ConfirmDialog";
import { EditableHeading } from "../common/EditableHeading";
import { LabelPicker } from "./LabelPicker";
import { MemberPicker } from "./MemberPicker";
import { DueDatePicker } from "./DueDatePicker";
import { PrioritySelect } from "./PrioritySelect";
import { CoverColorPicker } from "./CoverColorPicker";
import { ChecklistSection } from "./ChecklistSection";
import { AttachmentsSection } from "./AttachmentsSection";
import { ActivitySection } from "./ActivitySection";
import { MemberAvatar } from "../common/MemberAvatar";
import { useData } from "../../contexts/DataContext";
import { useUser } from "../../contexts/UserContext";
import { generateId } from "../../utils/id";
import { getPriority } from "../../constants/priority";
import { formatDueDate } from "../../utils/date";
import styles from "./CardDetailModal.module.css";

export function CardDetailModal({ cardId, onClose }) {
  const { cards, lists, boards, labels, members, activity, updateCard, deleteCard, duplicateCard, addActivity, addComment } =
    useData();
  const { currentUser } = useUser();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const descriptionInputRef = useRef(null);

  const card = cardId ? cards.byId[cardId] : null;
  const list = card ? lists.byId[card.listId] : null;
  const board = list ? boards.byId[list.boardId] : null;

  useEffect(() => {
    if (isEditingDescription) descriptionInputRef.current?.focus();
  }, [isEditingDescription]);

  const boardLabels = useMemo(
    () => (board ? labels.allIds.filter((id) => labels.byId[id].boardId === board.id).map((id) => labels.byId[id]) : []),
    [board, labels],
  );

  const candidateMembers = useMemo(() => members.allIds.map((id) => members.byId[id]), [members]);

  const cardActivity = useMemo(
    () => (card ? activity.allIds.filter((id) => activity.byId[id].cardId === card.id).map((id) => activity.byId[id]) : []),
    [card, activity],
  );

  const membersById = members.byId;

  const handleRename = useCallback(
    (title) => {
      updateCard(card.id, { title });
      addActivity(card.id, `renamed this card to "${title}"`);
    },
    [card, updateCard, addActivity],
  );

  const handleSaveDescription = useCallback(() => {
    if (descriptionDraft.trim() !== card.description) {
      updateCard(card.id, { description: descriptionDraft.trim() });
      addActivity(card.id, "updated the description");
    }
    setIsEditingDescription(false);
  }, [card, descriptionDraft, updateCard, addActivity]);

  const handleSetDueDate = useCallback(
    (dueDate) => {
      updateCard(card.id, { dueDate });
      addActivity(card.id, dueDate ? `set the due date to ${formatDueDate(dueDate)}` : "removed the due date");
    },
    [card, updateCard, addActivity],
  );

  const handleSetPriority = useCallback(
    (priority) => {
      updateCard(card.id, { priority });
      addActivity(card.id, `set priority to ${getPriority(priority).label}`);
    },
    [card, updateCard, addActivity],
  );

  const handleToggleLabel = useCallback(
    (labelId, selected) => {
      const label = labels.byId[labelId];
      updateCard(card.id, {
        labelIds: selected
          ? [...card.labelIds, labelId]
          : card.labelIds.filter((id) => id !== labelId),
      });
      addActivity(card.id, `${selected ? "added" : "removed"} the "${label.name}" label`);
    },
    [card, labels, updateCard, addActivity],
  );

  const handleToggleMember = useCallback(
    (memberId, selected) => {
      const member = members.byId[memberId];
      updateCard(card.id, {
        memberIds: selected
          ? [...card.memberIds, memberId]
          : card.memberIds.filter((id) => id !== memberId),
      });
      addActivity(card.id, `${selected ? "added" : "removed"} ${member.name}`);
    },
    [card, members, updateCard, addActivity],
  );

  const handleSetCoverColor = useCallback(
    (color) => {
      updateCard(card.id, { coverColor: color });
      addActivity(card.id, color ? "changed the cover" : "removed the cover");
    },
    [card, updateCard, addActivity],
  );

  const handleAddChecklistItem = useCallback(
    (text) => {
      updateCard(card.id, { checklist: [...card.checklist, { id: generateId(), text, done: false }] });
      addActivity(card.id, `added "${text}" to the checklist`);
    },
    [card, updateCard, addActivity],
  );

  const handleToggleChecklistItem = useCallback(
    (itemId) => {
      const item = card.checklist.find((i) => i.id === itemId);
      updateCard(card.id, {
        checklist: card.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)),
      });
      addActivity(card.id, `${item.done ? "unchecked" : "checked off"} "${item.text}"`);
    },
    [card, updateCard, addActivity],
  );

  const handleRemoveChecklistItem = useCallback(
    (itemId) => {
      updateCard(card.id, { checklist: card.checklist.filter((i) => i.id !== itemId) });
    },
    [card, updateCard],
  );

  const handleAddAttachment = useCallback(
    (meta) => {
      const attachment = { id: generateId(), ...meta, addedAt: new Date().toISOString() };
      updateCard(card.id, { attachments: [...card.attachments, attachment] });
      addActivity(card.id, `attached "${meta.name}"`);
    },
    [card, updateCard, addActivity],
  );

  const handleRemoveAttachment = useCallback(
    (attachmentId) => {
      updateCard(card.id, { attachments: card.attachments.filter((a) => a.id !== attachmentId) });
    },
    [card, updateCard],
  );

  const handleToggleArchive = useCallback(() => {
    updateCard(card.id, { archived: !card.archived });
    addActivity(card.id, card.archived ? "restored this card" : "archived this card");
  }, [card, updateCard, addActivity]);

  const handleDuplicate = useCallback(() => {
    duplicateCard(card.id);
    onClose();
  }, [card, duplicateCard, onClose]);

  const handleDeletePermanently = useCallback(() => {
    deleteCard(card.id);
    onClose();
  }, [card, deleteCard, onClose]);

  const handleAddComment = useCallback((text) => addComment(card.id, text), [card, addComment]);

  return (
    <Modal isOpen={Boolean(card)} onClose={onClose} title="Card details" size="lg">
      {card && (
        <div className={styles.wrapper}>
          {card.coverColor && <div className={styles.cover} style={{ background: card.coverColor }} />}

          <EditableHeading value={card.title} onSave={handleRename} level={2} className={styles.title} />

          {card.archived && <span className={styles.archivedBadge}>Archived</span>}

          <div className={styles.toolbar}>
            <LabelPicker
              boardId={board?.id}
              boardLabels={boardLabels}
              selectedLabelIds={card.labelIds}
              onToggle={handleToggleLabel}
            />
            <MemberPicker
              candidateMembers={candidateMembers}
              selectedMemberIds={card.memberIds}
              onToggle={handleToggleMember}
            />
            <DueDatePicker dueDate={card.dueDate} onChange={handleSetDueDate} />
            <PrioritySelect priority={card.priority} onChange={handleSetPriority} />
            <CoverColorPicker coverColor={card.coverColor} onChange={handleSetCoverColor} />
          </div>

          {(card.labelIds.length > 0 || card.memberIds.length > 0) && (
            <div className={styles.summaryRow}>
              {card.labelIds.length > 0 && (
                <div className={styles.labelChips}>
                  {card.labelIds.map((id) => {
                    const label = labels.byId[id];
                    return (
                      <span key={id} className={styles.labelChip} style={{ background: label.color }}>
                        {label.name}
                      </span>
                    );
                  })}
                </div>
              )}
              {card.memberIds.length > 0 && (
                <div className={styles.memberChips}>
                  {card.memberIds.map((id) => (
                    <MemberAvatar key={id} member={members.byId[id]} size="sm" />
                  ))}
                </div>
              )}
            </div>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <AlignLeft aria-hidden="true" />
              Description
            </h3>
            {isEditingDescription ? (
              <div className={styles.descriptionEditor}>
                <textarea
                  ref={descriptionInputRef}
                  className={styles.descriptionInput}
                  value={descriptionDraft}
                  onChange={(event) => setDescriptionDraft(event.target.value)}
                  onBlur={handleSaveDescription}
                  rows={4}
                />
                <div className={styles.descriptionActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsEditingDescription(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className={styles.saveButton} onClick={handleSaveDescription}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.descriptionButton}
                onClick={() => {
                  setDescriptionDraft(card.description);
                  setIsEditingDescription(true);
                }}
              >
                {card.description || "Add a more detailed description…"}
              </button>
            )}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <CheckSquare aria-hidden="true" />
              Checklist
            </h3>
            <ChecklistSection
              checklist={card.checklist}
              onAddItem={handleAddChecklistItem}
              onToggleItem={handleToggleChecklistItem}
              onRemoveItem={handleRemoveChecklistItem}
            />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Paperclip aria-hidden="true" />
              Attachments
            </h3>
            <AttachmentsSection
              attachments={card.attachments}
              onAdd={handleAddAttachment}
              onRemove={handleRemoveAttachment}
            />
          </section>

          <section className={styles.actionsRow}>
            <button type="button" className={styles.actionButton} onClick={handleToggleArchive}>
              {card.archived ? <ArchiveRestore aria-hidden="true" /> : <Archive aria-hidden="true" />}
              {card.archived ? "Restore" : "Archive"}
            </button>
            <button type="button" className={styles.actionButton} onClick={handleDuplicate}>
              <Copy aria-hidden="true" />
              Duplicate
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.danger}`}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </button>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <History aria-hidden="true" />
              Activity
            </h3>
            <ActivitySection
              entries={cardActivity}
              currentUser={currentUser}
              membersById={membersById}
              onAddComment={handleAddComment}
            />
          </section>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePermanently}
        title="Delete card?"
        description={`This will permanently delete "${card?.title}". This can't be undone.`}
        confirmLabel="Delete card"
        danger
      />
    </Modal>
  );
}
