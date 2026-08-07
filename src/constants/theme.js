// Keep this key literal in sync with the inline bootstrap script in
// index.html — that script runs before React (and this module) loads, so it
// can't import this constant and must hardcode the same string.
export const THEME_STORAGE_KEY = "trax-theme-preference";

export const THEME_MODES = {
  light: "light",
  dark: "dark",
  system: "system",
};
