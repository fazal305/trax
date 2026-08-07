import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { searchReducer, SEARCH_ACTIONS } from "../reducers/searchReducer";
import { storageService } from "../services/storageService";
import { STORAGE_KEYS } from "../constants/storageKeys";

const SearchContext = createContext(null);

const defaultState = { query: "", recentSearches: [] };

function loadInitialState() {
  // query is intentionally never persisted — only recentSearches survive
  // a refresh.
  const stored = storageService.get(STORAGE_KEYS.search, defaultState);
  return { ...defaultState, recentSearches: stored.recentSearches ?? defaultState.recentSearches };
}

export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, undefined, loadInitialState);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.search, { recentSearches: state.recentSearches });
  }, [state.recentSearches]);

  const setQuery = useCallback((query) => {
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: { query } });
  }, []);

  const addRecentSearch = useCallback((term) => {
    dispatch({ type: SEARCH_ACTIONS.ADD_RECENT_SEARCH, payload: { term } });
  }, []);

  const clearRecentSearches = useCallback(() => {
    dispatch({ type: SEARCH_ACTIONS.CLEAR_RECENT_SEARCHES });
  }, []);

  const value = useMemo(
    () => ({
      query: state.query,
      recentSearches: state.recentSearches,
      setQuery,
      addRecentSearch,
      clearRecentSearches,
    }),
    [state.query, state.recentSearches, setQuery, addRecentSearch, clearRecentSearches],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
}
