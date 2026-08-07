import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { userReducer, USER_ACTIONS } from "../reducers/userReducer";
import { storageService } from "../services/storageService";
import { STORAGE_KEYS } from "../constants/storageKeys";

const UserContext = createContext(null);

// "member-you" matches the seeded member id in data/seedData.js so the
// signed-in user is a real, assignable board member from the start.
const defaultState = {
  currentUser: {
    id: "member-you",
    name: "You",
    avatarSeed: "You",
    email: "you@example.com",
  },
};

function loadInitialState() {
  const stored = storageService.get(STORAGE_KEYS.user, defaultState);
  return { currentUser: { ...defaultState.currentUser, ...stored.currentUser } };
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, undefined, loadInitialState);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.user, state);
  }, [state]);

  const updateProfile = useCallback((changes) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: { changes } });
  }, []);

  const value = useMemo(
    () => ({ currentUser: state.currentUser, updateProfile }),
    [state.currentUser, updateProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
