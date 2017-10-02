import {
  FETCH_GAMING_SESSIONS,
  FETCH_GAMING_SESSIONS_RESULT,
  FETCH_GAMING_SESSIONS_ERROR,
  FETCH_GAMING_SESSIONS_NO_DATA,
  REFRESH_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS,
  FETCH_MY_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS_ERROR,
  FETCH_MY_GAMING_SESSIONS_NO_DATA,
  REFRESH_MY_GAMING_SESSIONS,
  FETCH_GROUP_GAMING_SESSIONS,
  FETCH_GROUP_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS_ERROR,
  FETCH_GROUP_GAMING_SESSIONS_NO_DATA,
  REFRESH_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT
} from "../actions/gamingSessions";

const initialState = {
  isLoading: false,
  endpoint: "https://the100.io/api/v2/gaming_sessions",
  refreshing: false,
  moreDataAvailable: true,
  moreGroupDataAvailable: true,
  gamingSessions: [],
  myGamingSessions: [],
  groupGamingSessions: []
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
        isLoading: false,
        refreshing: false
      };
    case FETCH_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        refreshing: false
      };
    case FETCH_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreDataAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case REFRESH_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        gamingSessions: [...state.gamingSessions, ...action.result],
        isLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS:
      return {
        ...state,
        isLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_MY_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        myGamingSessions: action.result,
        isLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreDataAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case REFRESH_MY_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case FETCH_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        isLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_GROUP_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        groupGamingSessions: action.result,
        isLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreGroupDataAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case REFRESH_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        groupGamingSessions: [...state.groupGamingSessions, ...action.result],
        isLoading: false,
        refreshing: false
      };
    default:
      return state;
  }
};
