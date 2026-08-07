import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { themeReducer, THEME_ACTIONS } from "../reducers/themeReducer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { storageService } from "../services/storageService";
import { THEME_STORAGE_KEY, THEME_MODES } from "../constants/theme";

const ThemeContext = createContext(null);

function loadInitialState() {
  return { mode: storageService.get(THEME_STORAGE_KEY, THEME_MODES.system) };
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, undefined, loadInitialState);
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const resolvedTheme =
    state.mode === THEME_MODES.system
      ? systemPrefersDark
        ? THEME_MODES.dark
        : THEME_MODES.light
      : state.mode;

  // Keep the DOM attribute the CSS actually reads on `resolvedTheme`, not on
  // `mode` — this is what makes "system" mode react live to OS changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    storageService.set(THEME_STORAGE_KEY, state.mode);
  }, [state.mode]);

  const setMode = useCallback((mode) => {
    dispatch({ type: THEME_ACTIONS.SET_MODE, payload: { mode } });
  }, []);

  // Convenience for simple light/dark toggle UI (e.g. the header button);
  // full light/dark/system control lives in Settings.
  const toggleTheme = useCallback(() => {
    setMode(resolvedTheme === THEME_MODES.dark ? THEME_MODES.light : THEME_MODES.dark);
  }, [resolvedTheme, setMode]);

  const value = useMemo(
    () => ({ mode: state.mode, resolvedTheme, setMode, toggleTheme }),
    [state.mode, resolvedTheme, setMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
