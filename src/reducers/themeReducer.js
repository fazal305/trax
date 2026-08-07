export const THEME_ACTIONS = {
  SET_MODE: "theme/setMode",
};

// mode: the user's explicit choice — "light" | "dark" | "system".
// resolvedTheme: the actual applied theme, computed from mode (+ OS
// preference when mode is "system"). Components should read resolvedTheme
// for rendering decisions and mode for the settings UI.
export function themeReducer(state, action) {
  switch (action.type) {
    case THEME_ACTIONS.SET_MODE:
      return { ...state, mode: action.payload.mode };
    default:
      return state;
  }
}
