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
  LOAD_MORE_MY_GAMING_SESSIONS,
  LOAD_MORE_MY_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS,
  FETCH_GROUP_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS_ERROR,
  FETCH_GROUP_GAMING_SESSIONS_NO_DATA,
  REFRESH_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT
} from "../actions/gamingSessions";

const initialState = {
  endpoint: "https://pwntastic.herokuapp.com/api/v2/gaming_sessions",
  refreshing: false,
  moreGamingSessionsAvailable: true,
  moreGroupGamingSessionsAvailable: true,
  moreMyGamingSessionsAvailable: true,

  gamingSessionsLoading: false,
  myGamingSessionsLoading: false,
  groupGamingSessionsLoading: false,

  gamingSessions: [],
  myGamingSessions: [],
  groupGamingSessions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMING_SESSIONS:
      return {
        ...state,
        gamingSessionsLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        gamingSessions: action.result,
        gamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        gamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreGamingSessionsAvailable: false,
        gamingSessionsLoading: false,
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
        gamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS:
      return {
        ...state,
        myGamingSessionsLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_MY_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        myGamingSessions: action.result,
        myGamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        myGamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreMyGamingSessionsAvailable: false,
        myGamingSessionsLoading: false,
        refreshing: false
      };
    case REFRESH_MY_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_MY_GAMING_SESSIONS:
      return {
        ...state,
        refreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_MY_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        myGamingSessions: [...state.myGamingSessions, ...action.result],
        myGamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        groupGamingSessionsLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_GROUP_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        groupGamingSessions: action.result,
        groupGamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        groupGamingSessionsLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreGroupGamingSessionsAvailable: false,
        groupGamingSessionsLoading: false,
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
        groupGamingSessionsLoading: false,
        refreshing: false
      };
    default:
      return state;
  }
};
