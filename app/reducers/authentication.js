import {
  FETCH_TOKEN,
  FETCH_TOKEN_RESULT,
  FETCH_TOKEN_ERROR,
  DECODE_TOKEN,
  DECODE_TOKEN_RESULT,
  DECODE_TOKEN_ERROR,
  REMOVE_TOKEN,
  REMOVE_TOKEN_ERROR,
  SET_FIREBASE_TOKEN,
  RESET_PASSWORD,
  RESET_PASSWORD_RESULT,
  RESET_PASSWORD_ERROR
} from "../actions/authentication";

export const initialState = {
  appLoading: true,
  isLoading: false,
  isAuthed: false,
  user: {},
  token: "",
  firebaseToken: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TOKEN:
      return {
        ...state,
        username: action.username,
        password: action.password,
        temp_auth_token: action.temp_auth_token,
        isLoading: true
      };
    case FETCH_TOKEN_RESULT:
      return {
        ...state,
        token: action.token,
        firebaseToken: action.firebaseToken
      };
    case FETCH_TOKEN_ERROR:
      return {
        ...state,
        error: action.error,
        errorAt: new Date(),
        isLoading: false,
        isAuthed: false,
        token: "",
        firebaseToken: ""
      };
    case DECODE_TOKEN:
      return {
        ...state,
        token: action.token,
        isLoading: true
      };
    case DECODE_TOKEN_RESULT:
      return {
        ...state,
        user: action.result,
        isLoading: false,
        isAuthed: true
      };
    case DECODE_TOKEN_ERROR:
      return {
        ...state,
        error: action.error,
        errorAt: new Date(),
        isLoading: false,
        isAuthed: false
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        isAuthed: false,
        isLoading: false,
        user: {},
        token: "",
        firebaseToken: ""
      };
    case REMOVE_TOKEN_ERROR:
      return {
        ...state,
        error: action.error,
        errorAt: new Date(),
        isLoading: false,
        isAuthed: false,
        user: {},
        token: ""
      };
    case SET_FIREBASE_TOKEN:
      return {
        ...state,
        firebaseToken: action.token
      };
    case RESET_PASSWORD:
      return {
        ...state,
        resettingPassword: true,
        resetPasswordEmail: action.resetPasswordEmail
      };
    case RESET_PASSWORD_RESULT:
      return {
        ...state,
        resettingPassword: false,
        success: "We've emailed you a link! Check your email to login.",
        successAt: new Date()
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        resettingPassword: false,
        error:
          "An error occured. Please try again or contact us for assistance.",
        errorAt: new Date()
      };
    default:
      return state;
  }
};
