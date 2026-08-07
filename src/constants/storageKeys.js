// localStorage keys for each persisted state slice. THEME_STORAGE_KEY lives
// in constants/theme.js (it must be duplicated as a literal in index.html's
// anti-FOUC script, so it's kept next to that context instead).
export const STORAGE_KEYS = {
  ui: "trax-ui-state",
  user: "trax-user-state",
  search: "trax-search-state",
  data: "trax-app-data",
};
