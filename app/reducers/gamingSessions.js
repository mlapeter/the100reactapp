import {
  FETCH_GAMING_SESSIONS,
  FETCH_GAMING_SESSIONS_RESULT,
  FETCH_GAMING_SESSIONS_ERROR
} from "../actions/gamingSessions";

const initialState = {
  isLoading: false,
  endpoint: "https://the100.io/api/v2/gaming_sessions",
  gamingSessions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMING_SESSIONS:
      return {
        ...state,
        isLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        gamingSessions: action.result,
        isLoading: false
      };
    case FETCH_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    default:
      return state;
  }
};
