# Trax

A Trello-inspired project management application built with React — workspaces, projects, boards, lists, and cards with drag-and-drop, labels, checklists, comments, filters, and a full dark/light/system theme. Everything runs client-side with `localStorage` persistence; there is no backend.

This is a portfolio project built to demonstrate professional React architecture: scalable state management with the Context API and `useReducer`, a token-driven design system with zero hardcoded styling values, reusable component composition, accessibility, and performance-conscious rendering.

> **Live demo:** [fazal305.github.io/trax](https://fazal305.github.io/trax/)

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [React concepts demonstrated](#react-concepts-demonstrated)
- [State management](#state-management)
- [Performance optimizations](#performance-optimizations)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Future roadmap](#future-roadmap)
- [Lessons learned](#lessons-learned)
- [License](#license)

## Features

**Workspaces** — multiple workspaces, a workspace switcher with create-workspace flow, member management, favorites.

**Projects** — multiple projects per workspace, descriptions, colors, archive/restore, search and filter within a workspace.

**Boards** — create/rename/delete/archive/favorite boards, custom background colors, private/workspace visibility.

**Lists** — create/rename/delete/archive/collapse lists, drag-to-reorder, an archived-lists recovery panel.

**Cards** — title, description, due dates, priority, labels, checklists with progress, file-reference attachments (metadata only — no real upload), member assignment, cover colors, comments, a full activity history, archive, and duplicate.

**Drag & drop** — cards can be reordered within a list or moved between lists (including onto an empty list); entire lists can be reordered — built on `@dnd-kit` with a live cross-list preview during drag and a single commit on drop.

**Labels** — per-board label management (create/rename/recolor/delete), multi-label assignment, filter-by-label.

**Members** — assignment, DiceBear-generated avatars, an editable identity color shown as a ring around every avatar, activity attribution.

**Search** — instant, case-insensitive search across boards, projects, cards, lists, labels, and members, with breadcrumbs and recent-search history; clicking a card result deep-links straight into that card's detail modal.

**Filters** — a multi-criteria board filter (member, label, priority, due date, checklist completion) that combines with AND/OR semantics; disables drag-and-drop while active to avoid corrupting card ordering.

**Activity feed** — a global, reverse-chronological feed of comments and system-logged changes across every board.

**Notifications** — computed (not stored) from existing data: due-soon/overdue reminders, assignment notices, and @mentions in comments, with an unread badge.

**Keyboard shortcuts** — `/` to search, `Ctrl`/`Cmd`+`K` for a command palette, `N`/`L` to quickly add a card or list on a board, `Esc` to close any modal. Full reference on the Help page.

**Settings** — theme mode (light/dark/system) and profile editing.

**Dark mode** — a complete token-driven theme system; every color, spacing, radius, shadow, and duration value comes from CSS custom properties, so theme switching is instant and there is nothing to patch per-component.

## Architecture

Trax is a single-page app: React 19 + Vite, `react-router-dom` (`HashRouter`, so it works on static hosts like GitHub Pages with no server-side routing config), and `@dnd-kit` for drag-and-drop. There is no backend — `DataContext` is the single source of truth for all domain data, persisted to `localStorage` on every change and rehydrated (merged over fresh seed data, so new fields introduced later don't break existing users) on load.

Routing is lazy-loaded per page (`React.lazy` + `Suspense`), so each route ships as its own chunk. An `ErrorBoundary` wraps the whole router.

## Folder structure

```
src/
  assets/            Static SVG brand assets
  components/
    board/           BoardCard, CreateBoardModal
    card/            Card tile, detail modal, and all its pickers/sections
    common/          Shared building blocks: Modal-agnostic pieces, EmptyState,
                      EditableHeading, MemberAvatar, CommandPalette, etc.
    filter/          FilterPanel (multi-criteria board filtering)
    label/           LabelManagerModal
    layout/          AppShell, Header, Sidebar
    list/            ListColumn, AddListComposer, archive panel
    modal/           Modal, ConfirmDialog primitives
    navigation/      NavItem
    notification/    NotificationsPanel
    project/         ProjectCard, CreateProjectModal
    search/          SearchResultItem
    workspace/       WorkspaceSwitcher, CreateWorkspaceModal, EditMemberModal
  constants/         Design tokens' JS mirrors, routes, nav items, priorities,
                      label colors, filters, storage keys
  contexts/          ThemeContext, UIContext, UserContext, SearchContext,
                      DataContext, and AppProviders composing them
  data/              seedData.js — realistic sample workspaces/boards/cards
  hooks/             useMediaQuery, useOnClickOutside, useNotifications,
                      useGlobalShortcuts, useBoardWithContext, ...
  pages/             One folder per route: Dashboard, Workspace, Project,
                      Board, Search, Settings, Activity, Help
  reducers/          One reducer per domain: data, ui, user, search, theme
  services/          storageService (localStorage wrapper)
  styles/            tokens.css, themes.css, global.css
  utils/             id, date, avatar, cardFilters
  App.jsx / main.jsx
public/
```

Every feature area gets its own component folder; no file mixes more than one concern.

## Installation

```bash
git clone https://github.com/fazal305/trax.git
cd trax
npm install
npm run dev
```

Open the printed local URL. The app seeds itself with realistic sample data on first run — no setup required.

## Usage

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # ESLint
npm run deploy    # build and publish dist/ to the gh-pages branch
```

Data lives entirely in your browser's `localStorage`. Clearing site data resets the app back to the seed state.

## React concepts demonstrated

- **Component architecture** — one component per file, composed rather than configured; presentational components (e.g. `CardTile`) are kept separate from their interactive/sortable wrappers (`SortableCardTile`) so they can be reused undecorated (e.g. inside a `DragOverlay`).
- **Context API** — five separated contexts (Theme, UI, User, Search, Data) instead of one giant store, avoiding prop drilling without over-centralizing unrelated state.
- **`useReducer`** — every context backed by a reducer with named, colocated action types; a generic `BATCH_UPDATE` action commits multi-entity changes (like a drag-and-drop reorder) atomically.
- **`useContext`** — one custom hook per context (`useData`, `useUI`, `useTheme`, `useUser`, `useSearch`) that throws a clear error if used outside its provider.
- **`useMemo`** — every derived list (filtered/sorted cards, search results, notifications) is memoized against its real dependencies.
- **`useCallback`** — every handler passed to a memoized child or into a dependency array is stabilized.
- **`useEffect`** — used strictly for syncing with external systems (persisting to `localStorage`, attaching `keydown` listeners, clearing router state after a deep link is consumed) — never as a substitute for derived state.
- **`useRef`** — DOM refs for focus management (`Modal`'s `initialFocusRef`), and imperative handles (`useImperativeHandle`) so keyboard shortcuts can open an inline composer without lifting its open/closed state.
- **Custom hooks** — `useMediaQuery` (built on `useSyncExternalStore`, not `useState`+`useEffect`, since it's subscribing to an external source), `useOnClickOutside`, `useBoardWithContext`, `useNotifications`, `useGlobalShortcuts`.
- **`React.memo`** — `BoardCard`, `ProjectCard`, `WorkspaceSummaryCard`, and `CardTile` skip re-renders when their parent re-renders with unchanged props.
- **Lazy loading / code splitting** — every route is `React.lazy`-loaded; the production build confirms each page ships as its own chunk.
- **Error boundaries** — a class-component `ErrorBoundary` (the one case hooks can't replace) wraps the router with a themed fallback and retry.
- **Local persistence** — a single `storageService` wrapper around `localStorage`, with defensive merging so schema additions never crash existing users' saved data.
- **Optimistic/local-first updates** — drag-and-drop maintains a local preview during the gesture and commits to `DataContext` once on drop, instead of writing to global state (and `localStorage`) on every pixel of movement.

## State management

State is deliberately split into five independent domains, each with its own Context + reducer + `localStorage` key:

| Domain | Context | Persisted |
|---|---|---|
| Theme | `ThemeContext` | mode only (`light`/`dark`/`system`) |
| UI | `UIContext` | sidebar collapsed, recent boards, active workspace, notifications-seen cursor |
| User | `UserContext` | your profile (name, avatar seed) |
| Search | `SearchContext` | recent search history (not the live query) |
| Data | `DataContext` | the entire domain graph — workspaces → projects → boards → lists → cards, plus labels, members, and activity |

`DataContext` holds every entity as a normalized `{ byId, allIds }` table (never nested), so updates are O(1) lookups and cascading deletes (e.g. deleting a workspace removes its projects, boards, lists, cards, labels, and activity entries) are explicit and testable in the reducer rather than implicit in component code.

## Performance optimizations

- `React.memo` on list-rendered cards (`BoardCard`, `ProjectCard`, `CardTile`) and summary rows.
- `useMemo`/`useCallback` throughout to avoid recomputing derived data or recreating handlers on every render.
- Route-based code splitting via `React.lazy`.
- A local (non-global-state) drag preview during drag-and-drop, so `DataContext` — and therefore `localStorage` — is only written once per drag, not on every pointer move.
- Real array keys everywhere (entity IDs), never array indexes.
- `useSyncExternalStore` for the media-query hook instead of an effect-driven `useState`, avoiding an extra render after mount.

## Accessibility

- Full keyboard navigation: every interactive control is a real `<button>`/`<input>`, modals trap and restore focus, and `Escape` closes the topmost modal.
- Visible focus rings (`:focus-visible`) driven by the same design tokens as everything else.
- `aria-label`, `aria-pressed`, `aria-selected`, and `role` attributes on custom controls (toggles, dropdowns, tabs) — checked with `eslint-plugin-jsx-a11y` as part of the lint pass.
- `prefers-reduced-motion` support: all transition/animation durations collapse to near-zero.
- `prefers-contrast: more` support: border colors strengthen automatically.
- Screen-reader-only utility class (`.sr-only`) for content that shouldn't be visible but must remain announced.

## Deployment

### GitHub Pages

Live at **[fazal305.github.io/trax](https://fazal305.github.io/trax/)**, served from the `gh-pages` branch.

To redeploy after changes:

```bash
npm run deploy
```

This builds the app and publishes `dist/` to the `gh-pages` branch via the `gh-pages` package — GitHub Pages picks up the update automatically (Settings → Pages is already configured to build from that branch). Note `vite.config.js`'s `base: '/trax/'` must match the repo name exactly, or assets will 404.

Because this is a fully static SPA using `HashRouter`, no server-side rewrite rules are needed for client-side routes to work on refresh.

## Future roadmap

- Real-time collaboration (would require a backend — this app is intentionally local-only today)
- Board templates
- CSV/JSON export and import of a workspace
- Custom fields on cards
- Recurring due dates
- A proper "empty checklist template" library

## Lessons learned

- **Design tokens first, features second.** Building the full CSS-variable design system (Step 3) before any feature UI meant every subsequent module — including modules 8–16, built well after the initial theme work — never touched a single hardcoded color. The dark-mode "module" ended up being a no-op audit instead of a retrofit.
- **Normalize early.** Switching every entity to `{ byId, allIds }` from the start made cascading deletes, drag-and-drop position math, and batch updates dramatically simpler than nested/denormalized state would have allowed.
- **`useReducer` action creators should generate their own IDs at the call site, not inside the reducer**, whenever a caller needs to know the new entity's ID immediately (e.g., "create a board, then navigate to it"). Generating IDs inside reducers works until the first feature needs the ID before the next render.
- **Blur-to-save inputs need an explicit visible affordance.** Relying solely on "click away to save" is a weak affordance for keyboard users; every inline editor in this app pairs blur-to-save with an explicit Save/Cancel pair or Enter-to-submit.
- **`setState` updater functions must stay pure.** A cross-component `dispatch` call from inside a `setState(prev => ...)` updater (found while wiring the notifications "mark as seen" toggle) triggers a real React warning about updating a component while rendering a different one — a good reminder that updater functions are not a safe place for side effects, even ones that "should" be harmless.

## License

MIT — see [LICENSE](LICENSE).
