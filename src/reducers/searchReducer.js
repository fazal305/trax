const MAX_RECENT_SEARCHES = 8;

export const SEARCH_ACTIONS = {
  SET_QUERY: "search/setQuery",
  ADD_RECENT_SEARCH: "search/addRecentSearch",
  CLEAR_RECENT_SEARCHES: "search/clearRecentSearches",
};

export function searchReducer(state, action) {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_QUERY:
      return { ...state, query: action.payload.query };

    case SEARCH_ACTIONS.ADD_RECENT_SEARCH: {
      const term = action.payload.term.trim();
      if (!term) return state;
      const withoutDuplicate = state.recentSearches.filter((t) => t !== term);
      return {
        ...state,
        recentSearches: [term, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES),
      };
    }

    case SEARCH_ACTIONS.CLEAR_RECENT_SEARCHES:
      return { ...state, recentSearches: [] };

    default:
      return state;
  }
}
