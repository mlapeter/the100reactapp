const AUTHENTICATING = "AUTHENTICATING";
const NOT_AUTHED = "NOT_AUTHED";
const IS_AUTHED = "IS_AUTHED";

function authenticating() {
  return {
    type: AUTHENTICATING
  };
}

function notAuthed() {
  return {
    type: NOT_AUTHED
  };
}

function isAuthed(token) {
  return {
    type: IS_AUTHED,
    token
  };
}

export function onAuthChange(token) {
  return function(dispatch) {
    if (!token) {
      dispatch(notAuthed());
    } else {
      dispatch(isAuthed(token));
    }
  };
}

const initialState = {
  isAuthed: false,
  isAuthenticating: false,
  authedId: "",
  token: ""
};

export const authentication = (state = initialState, action) => {
  switch (action.type) {
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

// export default function authentication(state = initialState, action) {
//   switch (action.type) {
//     default:
//       return state;
//   }
// }
