import Environment from "../config/environment";

import {
  CREATE_GAMING_SESSION,
  CREATE_GAMING_SESSION_RESULT,
  CREATE_GAMING_SESSION_ERROR,
  EDIT_GAMING_SESSION,
  EDIT_GAMING_SESSION_RESULT,
  EDIT_GAMING_SESSION_ERROR,
  DELETE_GAMING_SESSION,
  DELETE_GAMING_SESSION_RESULT,
  DELETE_GAMING_SESSION_ERROR,
  FETCH_GAMING_SESSION,
  FETCH_GAMING_SESSION_RESULT,
  FETCH_GAMING_SESSION_ERROR,
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
  CLEAR_MY_GAMING_SESSIONS,
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
  endpoint:
    Environment["API_BASE_URL"] +
    Environment["API_VERSION"] +
    "gaming_sessions",
  refreshing: false,
  isCreating: false,
  gameCreated: false,
  isLoading: false,
  gameEdited: false,
  moreGamingSessionsAvailable: true,
  moreGroupGamingSessionsAvailable: true,
  moreMyGamingSessionsAvailable: true,

  gamingSessionLoading: true,

  gamingSessionsLoading: false,
  myGamingSessionsLoading: false,
  groupGamingSessionsLoading: false,

  gamingSessionsRefreshing: false,
  myGamingSessionsRefreshing: false,
  groupGamingSessionsRefreshing: false,

  gamingSessions: [],
  myGamingSessions: [],
  groupGamingSessions: [],

  gamingSessionId: null,
  gamingSession: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAMING_SESSION:
      return {
        ...state,
        isCreating: true,
        gamingSession: action.gamingSession
      };
    case CREATE_GAMING_SESSION_RESULT:
      return {
        ...state,
        isCreating: false,
        gameCreated: true,
        successAt: new Date(),
        gamingSession: action.result
      };
    case CREATE_GAMING_SESSION_ERROR:
      return {
        ...state,
        isCreating: false,
        gameCreated: false,
        error: action.error,
        errorAt: new Date()
      };
    case EDIT_GAMING_SESSION:
      return {
        ...state,
        gameEdited: false,
        gameDeleted: false,
        isLoading: true,
        gamingSession: action.gamingSession
      };
    case EDIT_GAMING_SESSION_RESULT:
      return {
        ...state,
        isLoading: false,
        gameEdited: true,
        successAt: new Date(),
        gamingSession: action.result
      };
    case EDIT_GAMING_SESSION_ERROR:
      return {
        ...state,
        isLoading: false,
        gameEdited: false,
        error: action.error,
        errorAt: new Date()
      };
    case DELETE_GAMING_SESSION:
      return {
        ...state,
        gameEdited: false,
        gameDeleted: false,
        isLoading: true,
        deleteGamingSessionId: action.deleteGamingSessionId
      };
    case DELETE_GAMING_SESSION_RESULT:
      return {
        ...state,
        isLoading: false,
        gameDeleted: true,
        successAt: new Date(),
        gamingSession: action.result
      };
    case DELETE_GAMING_SESSION_ERROR:
      return {
        ...state,
        isLoading: false,
        gameDeleted: false,
        error: action.error,
        errorAt: new Date()
      };
    case FETCH_GAMING_SESSION:
      return {
        ...state,
        gamingSessionLoading: true,
        gamingSessionId: action.gamingSessionId
      };
    case FETCH_GAMING_SESSION_RESULT:
      return {
        ...state,
        gamingSession: action.result,
        gamingSessionLoading: false
      };
    case FETCH_GAMING_SESSION_ERROR:
      return {
        ...state,
        error: action.error,
        errorAt: new Date(),
        gamingSessionLoading: true
      };
    case FETCH_GAMING_SESSIONS:
      return {
        ...state,
        moreGamingSessionsAvailable: true,
        gamingSessionsLoading: true,
        endpoint: action.endpoint
      };
    case FETCH_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        gamingSessions: action.result,
        gamingSessionsLoading: false,
        gamingSessionsRefreshing: false
      };
    case FETCH_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        gamingSessionsLoading: false,
        gamingSessionsRefreshing: false,
        moreGamingSessionsAvailable: false
      };
    case FETCH_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreGamingSessionsAvailable: false,
        gamingSessionsLoading: false,
        gamingSessionsRefreshing: false
      };

    case REFRESH_GAMING_SESSIONS:
      return {
        ...state,
        moreGamingSessionsAvailable: true,
        gamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GAMING_SESSIONS:
      return {
        ...state,
        gamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        gamingSessions: [...state.gamingSessions, ...action.result],
        gamingSessionsLoading: false,
        gamingSessionsRefreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS:
      return {
        ...state,
        moreMyGamingSessionsAvailable: true,
        myGamingSessionsLoading: true
      };
    case FETCH_MY_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        myGamingSessions: action.result,
        myGamingSessionsLoading: false,
        myGamingSessionsRefreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        myGamingSessionsLoading: false,
        myGamingSessionsRefreshing: false
      };
    case FETCH_MY_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreMyGamingSessionsAvailable: false,
        myGamingSessionsLoading: false,
        myGamingSessionsRefreshing: false
      };
    case CLEAR_MY_GAMING_SESSIONS:
      return {
        ...state,
        myGamingSessions: [],
        myGamingSessionsLoading: true,
        moreGamingSessionsAvailable: true,
        gamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case REFRESH_MY_GAMING_SESSIONS:
      return {
        ...state,
        moreMyGamingSessionsAvailable: true,
        myGamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_MY_GAMING_SESSIONS:
      return {
        ...state,
        myGamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_MY_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        myGamingSessions: [...state.myGamingSessions, ...action.result],
        myGamingSessionsLoading: false,
        myGamingSessionsRefreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        groupGamingSessionsLoading: true
      };
    case FETCH_GROUP_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        moreGroupGamingSessionsAvailable: true,
        groupGamingSessions: action.result,
        groupGamingSessionsLoading: false,
        groupGamingSessionsRefreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_ERROR:
      return {
        ...state,
        error: action.error,
        groupGamingSessionsLoading: false,
        groupGamingSessionsRefreshing: false
      };
    case FETCH_GROUP_GAMING_SESSIONS_NO_DATA:
      return {
        ...state,
        moreGroupGamingSessionsAvailable: false,
        groupGamingSessionsLoading: false,
        groupGamingSessionsRefreshing: false
      };
    case REFRESH_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        moreGroupGamingSessionsAvailable: true,
        groupGamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GROUP_GAMING_SESSIONS:
      return {
        ...state,
        groupGamingSessionsRefreshing: true,
        endpoint: action.endpoint
      };
    case LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT:
      return {
        ...state,
        groupGamingSessions: [...state.groupGamingSessions, ...action.result],
        groupGamingSessionsLoading: false,
        groupGamingSessionsRefreshing: false
      };
    default:
      return state;
  }
};
