export const CHANGE_ACTIVITY = "CHANGE_ACTIVITY";
export const CHANGE_GAME = "CHANGE_GAME";
export const CHANGE_PAGE = "CHANGE_PAGE";
export const CHANGE_PLATFORM = "CHANGE_PLATFORM";
export const FETCH_GAMES = "FETCH_GAMES";

export const changeActivity = activity => ({
  type: CHANGE_ACTIVITY,
  activity
});

export const changeGame = gameId => ({
  type: CHANGE_GAME,
  gameId
});

export const changePage = page => ({
  type: CHANGE_PAGE,
  page
});

export const changePlatform = platform => ({
  type: CHANGE_PLATFORM,
  platform
});

export const fetchGames = games => ({
  type: FETCH_GAMES,
  games
});
