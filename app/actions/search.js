export const CHANGE_ACTIVITY = "CHANGE_ACTIVITY";
export const CHANGE_GAME = "CHANGE_GAME";
export const CHANGE_GAMING_SESSIONS_PAGE = "CHANGE_GAMING_SESSIONS_PAGE";
export const CHANGE_MY_GAMING_SESSIONS_PAGE = "CHANGE_MY_GAMING_SESSIONS_PAGE";
export const CHANGE_GROUP_GAMING_SESSIONS_PAGE =
  "CHANGE_GROUP_GAMING_SESSIONS_PAGE";
export const CHANGE_RECENT_GAMING_SESSIONS_PAGE =
  "CHANGE_RECENT_GAMING_SESSIONS_PAGE";
export const CHANGE_PLATFORM = "CHANGE_PLATFORM";
export const TOGGLE_NOT_FULL = "TOGGLE_NOT_FULL";
export const FETCH_GAMES = "FETCH_GAMES";
export const FETCH_GAMES_RESULT = "FETCH_GAMES_RESULT";
export const FETCH_GAMES_ERROR = "FETCH_GAMES_ERROR";
export const FETCH_ACTIVITIES_RESULT = "FETCH_ACTIVITIES_RESULT";

export const changeActivity = activity => ({
  type: CHANGE_ACTIVITY,
  activity
});

export const changeGame = gameId => ({
  type: CHANGE_GAME,
  gameId
});

export const changePlatform = platform => ({
  type: CHANGE_PLATFORM,
  platform
});

export const fetchGames = games => ({
  type: FETCH_GAMES,
  games
});

export const toggleNotFull = notFull => ({
  type: TOGGLE_NOT_FULL,
  notFull
});
