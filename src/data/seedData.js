import { generateId } from "../utils/id";

function toNormalized(items) {
  const byId = {};
  const allIds = [];
  for (const item of items) {
    byId[item.id] = item;
    allIds.push(item.id);
  }
  return { byId, allIds };
}

const now = Date.now();
const days = (n) => new Date(now + n * 86400000).toISOString();

// Members — "You" matches the default UserContext profile id so the
// currently-signed-in user shows up as a real assignable member. `color` is
// an explicit, user-editable identity color (shown as a ring around their
// avatar everywhere), not derived from the avatar itself.
const members = [
  { id: "member-you", name: "You", avatarSeed: "You", role: "Owner", color: "var(--label-blue)" },
  {
    id: "member-ayesha",
    name: "Ayesha Khan",
    avatarSeed: "Ayesha Khan",
    role: "Admin",
    color: "var(--label-purple)",
  },
  {
    id: "member-bilal",
    name: "Bilal Ahmed",
    avatarSeed: "Bilal Ahmed",
    role: "Member",
    color: "var(--label-orange)",
  },
  {
    id: "member-sara",
    name: "Sara Malik",
    avatarSeed: "Sara Malik",
    role: "Member",
    color: "var(--label-lime)",
  },
];

const workspaces = [
  {
    id: "ws-personal",
    name: "Personal Workspace",
    color: "var(--color-brand)",
    favorite: true,
    memberIds: ["member-you"],
    createdAt: days(-120),
  },
  {
    id: "ws-acme",
    name: "Acme Inc",
    color: "var(--color-accent)",
    favorite: false,
    memberIds: ["member-you", "member-ayesha", "member-bilal", "member-sara"],
    createdAt: days(-90),
  },
];

const projects = [
  {
    id: "proj-personal-goals",
    workspaceId: "ws-personal",
    name: "Personal Goals",
    description: "Habits, learning, and side projects.",
    color: "var(--label-blue)",
    archived: false,
    createdAt: days(-118),
  },
  {
    id: "proj-product",
    workspaceId: "ws-acme",
    name: "Product",
    description: "Core product roadmap and sprint execution.",
    color: "var(--label-purple)",
    archived: false,
    createdAt: days(-88),
  },
  {
    id: "proj-marketing",
    workspaceId: "ws-acme",
    name: "Marketing",
    description: "Campaigns, launches, and content calendar.",
    color: "var(--label-pink)",
    archived: false,
    createdAt: days(-60),
  },
];

const boards = [
  {
    id: "board-roadmap",
    projectId: "proj-personal-goals",
    name: "2026 Roadmap",
    background: "var(--color-brand)",
    visibility: "private",
    favorite: true,
    archived: false,
    createdAt: days(-118),
  },
  {
    id: "board-sprint",
    projectId: "proj-product",
    name: "Sprint Board",
    background: "var(--color-accent)",
    visibility: "workspace",
    favorite: true,
    archived: false,
    createdAt: days(-88),
  },
  {
    id: "board-campaign",
    projectId: "proj-marketing",
    name: "Campaign Planning",
    background: "var(--label-pink)",
    visibility: "workspace",
    favorite: false,
    archived: false,
    createdAt: days(-58),
  },
];

const lists = [
  { id: "list-roadmap-backlog", boardId: "board-roadmap", name: "Backlog", position: 0, collapsed: false, archived: false },
  { id: "list-roadmap-progress", boardId: "board-roadmap", name: "In Progress", position: 1, collapsed: false, archived: false },
  { id: "list-roadmap-done", boardId: "board-roadmap", name: "Done", position: 2, collapsed: false, archived: false },

  { id: "list-sprint-todo", boardId: "board-sprint", name: "To Do", position: 0, collapsed: false, archived: false },
  { id: "list-sprint-progress", boardId: "board-sprint", name: "In Progress", position: 1, collapsed: false, archived: false },
  { id: "list-sprint-review", boardId: "board-sprint", name: "Review", position: 2, collapsed: false, archived: false },
  { id: "list-sprint-done", boardId: "board-sprint", name: "Done", position: 3, collapsed: false, archived: false },

  { id: "list-campaign-ideas", boardId: "board-campaign", name: "Ideas", position: 0, collapsed: false, archived: false },
  { id: "list-campaign-planned", boardId: "board-campaign", name: "Planned", position: 1, collapsed: false, archived: false },
  { id: "list-campaign-live", boardId: "board-campaign", name: "Live", position: 2, collapsed: false, archived: false },
];

const labels = [
  { id: "label-bug", boardId: "board-sprint", name: "Bug", color: "var(--label-red)" },
  { id: "label-feature", boardId: "board-sprint", name: "Feature", color: "var(--label-green)" },
  { id: "label-urgent", boardId: "board-sprint", name: "Urgent", color: "var(--label-orange)" },
  { id: "label-design", boardId: "board-sprint", name: "Design", color: "var(--label-purple)" },
  { id: "label-backend", boardId: "board-sprint", name: "Backend", color: "var(--label-blue)" },
  { id: "label-roadmap-goal", boardId: "board-roadmap", name: "Goal", color: "var(--label-lime)" },
  { id: "label-campaign-social", boardId: "board-campaign", name: "Social", color: "var(--label-sky)" },
];

function card(overrides) {
  return {
    id: generateId(),
    description: "",
    dueDate: null,
    priority: "none",
    labelIds: [],
    memberIds: [],
    checklist: [],
    attachments: [],
    coverColor: null,
    archived: false,
    createdAt: days(-30),
    ...overrides,
  };
}

const cards = [
  card({
    id: "card-roadmap-1",
    listId: "list-roadmap-backlog",
    title: "Read 12 books this year",
    priority: "low",
    labelIds: ["label-roadmap-goal"],
    memberIds: ["member-you"],
    checklist: [
      { id: generateId(), text: "Pick January book", done: true },
      { id: generateId(), text: "Pick February book", done: false },
    ],
  }),
  card({
    id: "card-roadmap-2",
    listId: "list-roadmap-progress",
    title: "Learn TypeScript",
    priority: "medium",
    labelIds: ["label-roadmap-goal"],
    memberIds: ["member-you"],
    dueDate: days(14),
  }),
  card({
    id: "card-roadmap-3",
    listId: "list-roadmap-done",
    title: "Set up home office",
    priority: "low",
    memberIds: ["member-you"],
  }),

  card({
    id: "card-sprint-1",
    listId: "list-sprint-todo",
    title: "Design onboarding empty states",
    priority: "medium",
    labelIds: ["label-design"],
    memberIds: ["member-sara"],
    dueDate: days(5),
  }),
  card({
    id: "card-sprint-2",
    listId: "list-sprint-todo",
    title: "Fix pagination bug on reports page",
    priority: "high",
    labelIds: ["label-bug", "label-urgent"],
    memberIds: ["member-bilal"],
    dueDate: days(-1),
  }),
  card({
    id: "card-sprint-3",
    listId: "list-sprint-progress",
    title: "Implement rate limiting middleware",
    priority: "high",
    labelIds: ["label-backend"],
    memberIds: ["member-bilal", "member-you"],
    dueDate: days(2),
    checklist: [
      { id: generateId(), text: "Add token bucket logic", done: true },
      { id: generateId(), text: "Wire up Redis store", done: false },
      { id: generateId(), text: "Add tests", done: false },
    ],
  }),
  card({
    id: "card-sprint-4",
    listId: "list-sprint-progress",
    title: "Build activity feed component",
    priority: "medium",
    labelIds: ["label-feature"],
    memberIds: ["member-ayesha"],
    dueDate: days(7),
  }),
  card({
    id: "card-sprint-5",
    listId: "list-sprint-review",
    title: "Review Q3 roadmap doc",
    priority: "low",
    memberIds: ["member-you", "member-ayesha"],
  }),
  card({
    id: "card-sprint-6",
    listId: "list-sprint-done",
    title: "Ship dark mode toggle",
    priority: "medium",
    labelIds: ["label-feature"],
    memberIds: ["member-sara"],
  }),

  card({
    id: "card-campaign-1",
    listId: "list-campaign-ideas",
    title: "Product Hunt launch concept",
    priority: "medium",
    labelIds: ["label-campaign-social"],
    memberIds: ["member-ayesha"],
  }),
  card({
    id: "card-campaign-2",
    listId: "list-campaign-planned",
    title: "Q4 newsletter draft",
    priority: "low",
    dueDate: days(10),
    memberIds: ["member-sara"],
  }),
  card({
    id: "card-campaign-3",
    listId: "list-campaign-live",
    title: "Instagram teaser campaign",
    priority: "medium",
    labelIds: ["label-campaign-social"],
    memberIds: ["member-ayesha", "member-sara"],
  }),
];

// Assign position from each card's order within its list (the array order
// above already reflects the intended sequence) instead of hand-numbering
// every literal.
const positionCountByList = {};
for (const c of cards) {
  const nextPosition = positionCountByList[c.listId] ?? 0;
  c.position = nextPosition;
  positionCountByList[c.listId] = nextPosition + 1;
}

// Activity entries: type "system" for auto-logged events, "comment" for user
// comments. Both render in the same chronological feed on a card, same as
// Trello — kept in one table so the future Activity Feed module can reuse it
// filtered by board/workspace instead of cardId.
const activity = [
  {
    id: generateId(),
    cardId: "card-sprint-3",
    type: "system",
    message: "added the Backend label",
    actorId: "member-bilal",
    createdAt: days(-6),
  },
  {
    id: generateId(),
    cardId: "card-sprint-3",
    type: "comment",
    text: "Started on the token bucket implementation, should have a draft PR up tomorrow.",
    actorId: "member-bilal",
    createdAt: days(-5),
  },
  {
    id: generateId(),
    cardId: "card-sprint-3",
    type: "system",
    message: "checked off \"Add token bucket logic\"",
    actorId: "member-bilal",
    createdAt: days(-4),
  },
  {
    id: generateId(),
    cardId: "card-sprint-2",
    type: "comment",
    text: "This is blocking the reports demo — can we prioritize?",
    actorId: "member-you",
    createdAt: days(-2),
  },
];

export function createSeedData() {
  return {
    workspaces: toNormalized(workspaces),
    projects: toNormalized(projects),
    boards: toNormalized(boards),
    lists: toNormalized(lists),
    cards: toNormalized(cards),
    labels: toNormalized(labels),
    members: toNormalized(members),
    activity: toNormalized(activity),
  };
}
