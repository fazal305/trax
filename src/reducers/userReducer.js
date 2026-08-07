export const USER_ACTIONS = {
  UPDATE_PROFILE: "user/updateProfile",
};

export function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload.changes },
      };
    default:
      return state;
  }
}
