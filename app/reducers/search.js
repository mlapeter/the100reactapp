import Environment from "../config/environment";

import {
  CHANGE_ACTIVITY,
  CHANGE_GAME,
  CHANGE_GAMING_SESSIONS_PAGE,
  CHANGE_MY_GAMING_SESSIONS_PAGE,
  CHANGE_GROUP_GAMING_SESSIONS_PAGE,
  CHANGE_RECENT_GAMING_SESSIONS_PAGE,
  CHANGE_PLATFORM,
  TOGGLE_NOT_FULL,
  FETCH_GAMES,
  FETCH_GAMES_RESULT,
  FETCH_GAMES_ERROR,
  FETCH_ACTIVITIES_RESULT
} from "../actions/search";

const initialState = {
  activity: "",
  gameId: null,
  games: null,
  game: {},
  activities: [],
  notFull: 0,
  gamingSessionsPage: 1,
  myGamingSessionsPage: 1,
  groupGamingSessionsPage: 1,
  recentGamingSessionsPage: 1,
  platform: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };
    case CHANGE_GAME:
      return {
        ...state,
        gameId: action.gameId
      };
    case CHANGE_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        gamingSessionsPage: action.page
      };
    case CHANGE_MY_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        myGamingSessionsPage: action.page
      };
    case CHANGE_GROUP_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        groupGamingSessionsPage: action.page
      };
    case CHANGE_RECENT_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        recentGamingSessionsPage: action.page
      };
    case CHANGE_PLATFORM:
      return {
        ...state,
        platform: action.platform
      };
    case TOGGLE_NOT_FULL:
      return {
        ...state,
        notFull: action.notFull
      };
    case FETCH_GAMES:
      return {
        ...state
      };
    case FETCH_GAMES_RESULT:
      return {
        ...state,
        games: action.result
      };
    case FETCH_GAMES_ERROR:
      return {
        ...state,
        error: action.error
      };
    case FETCH_ACTIVITIES_RESULT:
      return {
        ...state,
        game: action.game,
        activities: action.activities
      };
    default:
      return state;
  }
};
