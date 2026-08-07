import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Layers, CreditCard, List, Tag, User, Clock } from "lucide-react";
import { useSearch } from "../../contexts/SearchContext";
import { useData } from "../../contexts/DataContext";
import { SearchInput } from "../../components/common/SearchInput";
import { SearchResultItem } from "../../components/search/SearchResultItem";
import { EmptyState } from "../../components/common/EmptyState";
import { ROUTES } from "../../constants/routes";
import styles from "./Search.module.css";

function matches(query, ...fields) {
  return fields.some((field) => field && field.toLowerCase().includes(query));
}

export default function Search() {
  const { query, setQuery, recentSearches, addRecentSearch, clearRecentSearches } = useSearch();
  const { workspaces, projects, boards, lists, cards, labels, members } = useData();
  const navigate = useNavigate();

  const trimmedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmedQuery) return null;

    const boardResults = boards.allIds
      .filter((id) => matches(trimmedQuery, boards.byId[id].name))
      .map((id) => {
        const board = boards.byId[id];
        const project = projects.byId[board.projectId];
        const workspace = project ? workspaces.byId[project.workspaceId] : null;
        return { id, board, subtitle: [workspace?.name, project?.name].filter(Boolean).join(" / ") };
      });

    const projectResults = projects.allIds
      .filter((id) => matches(trimmedQuery, projects.byId[id].name, projects.byId[id].description))
      .map((id) => {
        const project = projects.byId[id];
        const workspace = workspaces.byId[project.workspaceId];
        return { id, project, subtitle: workspace?.name };
      });

    const listResults = lists.allIds
      .filter((id) => matches(trimmedQuery, lists.byId[id].name))
      .map((id) => {
        const list = lists.byId[id];
        const board = boards.byId[list.boardId];
        return { id, list, board, subtitle: board?.name };
      });

    const cardResults = cards.allIds
      .filter((id) => matches(trimmedQuery, cards.byId[id].title, cards.byId[id].description))
      .map((id) => {
        const card = cards.byId[id];
        const list = lists.byId[card.listId];
        const board = list ? boards.byId[list.boardId] : null;
        return { id, card, board, subtitle: [board?.name, list?.name].filter(Boolean).join(" / ") };
      });

    const labelResults = labels.allIds
      .filter((id) => matches(trimmedQuery, labels.byId[id].name))
      .map((id) => {
        const label = labels.byId[id];
        const board = boards.byId[label.boardId];
        return { id, label, board, subtitle: board?.name };
      });

    const memberResults = members.allIds
      .filter((id) => matches(trimmedQuery, members.byId[id].name))
      .map((id) => ({ id, member: members.byId[id] }));

    return {
      boards: boardResults,
      projects: projectResults,
      lists: listResults,
      cards: cardResults,
      labels: labelResults,
      members: memberResults,
    };
  }, [trimmedQuery, workspaces, projects, boards, lists, cards, labels, members]);

  const totalCount = results
    ? Object.values(results).reduce((sum, group) => sum + group.length, 0)
    : 0;

  const recordSearch = useCallback(() => {
    if (trimmedQuery) addRecentSearch(query.trim());
  }, [trimmedQuery, query, addRecentSearch]);

  const goToBoard = useCallback(
    (boardId) => {
      recordSearch();
      navigate(ROUTES.board(boardId));
    },
    [recordSearch, navigate],
  );

  const goToProject = useCallback(
    (project) => {
      recordSearch();
      navigate(ROUTES.project(project.workspaceId, project.id));
    },
    [recordSearch, navigate],
  );

  return (
    <div className={styles.page}>
      <h1>Search</h1>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search boards, projects, cards, lists, labels, members…"
      />

      {!trimmedQuery && (
        <section className={styles.section}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock aria-hidden="true" />
              Recent searches
            </h2>
            {recentSearches.length > 0 && (
              <button type="button" className={styles.clearButton} onClick={clearRecentSearches}>
                Clear
              </button>
            )}
          </div>
          {recentSearches.length > 0 ? (
            <div className={styles.recentChips}>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={styles.recentChip}
                  onClick={() => setQuery(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Searches you run will show up here.</p>
          )}
        </section>
      )}

      {trimmedQuery && totalCount === 0 && (
        <EmptyState title="No results" description={`Nothing matches "${query.trim()}".`} />
      )}

      {trimmedQuery && totalCount > 0 && (
        <div className={styles.results}>
          {results.boards.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Boards</h2>
              {results.boards.map(({ id, board, subtitle }) => (
                <SearchResultItem
                  key={id}
                  icon={LayoutDashboard}
                  iconColor={board.background}
                  title={board.name}
                  subtitle={subtitle}
                  onClick={() => goToBoard(board.id)}
                />
              ))}
            </section>
          )}

          {results.projects.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {results.projects.map(({ id, project, subtitle }) => (
                <SearchResultItem
                  key={id}
                  icon={Layers}
                  iconColor={project.color}
                  title={project.name}
                  subtitle={subtitle}
                  onClick={() => goToProject(project)}
                />
              ))}
            </section>
          )}

          {results.cards.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cards</h2>
              {results.cards.map(({ id, card, board, subtitle }) =>
                board ? (
                  <SearchResultItem
                    key={id}
                    icon={CreditCard}
                    iconColor="var(--color-brand)"
                    title={card.title}
                    subtitle={subtitle}
                    onClick={() => {
                      recordSearch();
                      navigate(ROUTES.board(board.id), { state: { openCardId: card.id } });
                    }}
                  />
                ) : null,
              )}
            </section>
          )}

          {results.lists.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Lists</h2>
              {results.lists.map(({ id, list, board, subtitle }) =>
                board ? (
                  <SearchResultItem
                    key={id}
                    icon={List}
                    iconColor="var(--color-accent)"
                    title={list.name}
                    subtitle={subtitle}
                    onClick={() => goToBoard(board.id)}
                  />
                ) : null,
              )}
            </section>
          )}

          {results.labels.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Labels</h2>
              {results.labels.map(({ id, label, board, subtitle }) =>
                board ? (
                  <SearchResultItem
                    key={id}
                    icon={Tag}
                    iconColor={label.color}
                    title={label.name}
                    subtitle={subtitle}
                    onClick={() => goToBoard(board.id)}
                  />
                ) : null,
              )}
            </section>
          )}

          {results.members.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Members</h2>
              {results.members.map(({ id, member }) => (
                <SearchResultItem
                  key={id}
                  icon={User}
                  iconColor={member.color}
                  title={member.name}
                  subtitle={member.role}
                  onClick={recordSearch}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
