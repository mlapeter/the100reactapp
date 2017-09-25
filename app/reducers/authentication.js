import {
  AUTHENTICATING,
  NOT_AUTHED,
  IS_AUTHED,
  ON_AUTH_CHANGE
} from "../actions/authentication";

const initialState = {
  isAuthed: false,
  isAuthenticating: false,
  authedId: "",
  token: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_AUTH_CHANGE:
      if (!action.token) {
        return {
          ...state,
          isAuthed: false,
          isAuthenticating: false,
          authedId: "",
          token: ""
        };
      } else {
        return {
          ...state,
          isAuthed: true,
          isAuthenticating: false,
          authedId: "",
          token: action.token
        };
      }
    case AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: true
      };
    case NOT_AUTHED:
      return {
        isAuthenticating: false,
        isAuthed: false,
        authedId: "",
        token: ""
      };
    case IS_AUTHED:
      return {
        isAuthed: true,
        isAuthenticating: false,
        token: action.token
      };
    default:
      return state;
  }
};

// export default reducer(initialState, onAuthChange);
