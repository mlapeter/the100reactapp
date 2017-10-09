export const CREATE_GAMING_SESSION = "CREATE_GAMING_SESSION";
export const CREATE_GAMING_SESSION_RESULT =
  "CREATE_GAMING_SESSION_ERROR_RESULT";
export const CREATE_GAMING_SESSION_ERROR = "CREATE_GAMING_SESSION_ERROR";

export const FETCH_GAMING_SESSIONS = "FETCH_GAMING_SESSIONS";
export const FETCH_GAMING_SESSIONS_RESULT = "FETCH_GAMING_SESSIONS_RESULT";
export const FETCH_GAMING_SESSIONS_ERROR = "FETCH_GAMING_SESSIONS_ERROR";
export const FETCH_GAMING_SESSIONS_NO_DATA = "FETCH_GAMING_SESSIONS_NO_DATA";
export const REFRESH_GAMING_SESSIONS = "REFRESH_GAMING_SESSIONS";
export const LOAD_MORE_GAMING_SESSIONS = "LOAD_MORE_GAMING_SESSIONS";
export const LOAD_MORE_GAMING_SESSIONS_RESULT =
  "LOAD_MORE_GAMING_SESSIONS_RESULT";

export const FETCH_MY_GAMING_SESSIONS = "FETCH_MY_GAMING_SESSIONS";
export const FETCH_MY_GAMING_SESSIONS_RESULT =
  "FETCH_MY_GAMING_SESSIONS_RESULT";
export const FETCH_MY_GAMING_SESSIONS_ERROR = "FETCH_MY_GAMING_SESSIONS_ERROR";
export const FETCH_MY_GAMING_SESSIONS_NO_DATA =
  "FETCH_MY_GAMING_SESSIONS_NO_DATA";
export const REFRESH_MY_GAMING_SESSIONS = "REFRESH_MY_GAMING_SESSIONS";
export const LOAD_MORE_MY_GAMING_SESSIONS = "LOAD_MORE_MY_GAMING_SESSIONS";
export const LOAD_MORE_MY_GAMING_SESSIONS_RESULT =
  "LOAD_MORE_MY_GAMING_SESSIONS_RESULT";

export const FETCH_GROUP_GAMING_SESSIONS = "FETCH_GROUP_GAMING_SESSIONS";
export const FETCH_GROUP_GAMING_SESSIONS_RESULT =
  "FETCH_GROUP_GAMING_SESSIONS_RESULT";
export const FETCH_GROUP_GAMING_SESSIONS_ERROR =
  "FETCH_GROUP_GAMING_SESSIONS_ERROR";
export const FETCH_GROUP_GAMING_SESSIONS_NO_DATA =
  "FETCH_GROUP_GAMING_SESSIONS_NO_DATA";
export const REFRESH_GROUP_GAMING_SESSIONS = "REFRESH_GROUP_GAMING_SESSIONS";
export const LOAD_MORE_GROUP_GAMING_SESSIONS =
  "LOAD_MORE_GROUP_GAMING_SESSIONS";
export const LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT =
  "LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT";

export const createGamingSession = gamingSession => ({
  type: CREATE_GAMING_SESSION,
  gamingSession
});

export const fetchGamingSessions = endpoint => ({
  type: FETCH_GAMING_SESSIONS,
  endpoint
});

export const refreshGamingSessions = endpoint => ({
  type: REFRESH_GAMING_SESSIONS,
  endpoint
});

export const loadMoreGamingSessions = endpoint => ({
  type: LOAD_MORE_GAMING_SESSIONS,
  endpoint
});

export const fetchMyGamingSessions = endpoint => ({
  type: FETCH_MY_GAMING_SESSIONS,
  endpoint
});

export const refreshMyGamingSessions = endpoint => ({
  type: REFRESH_MY_GAMING_SESSIONS,
  endpoint
});

export const loadMoreMyGamingSessions = endpoint => ({
  type: LOAD_MORE_MY_GAMING_SESSIONS,
  endpoint
});

export const fetchGroupGamingSessions = endpoint => ({
  type: FETCH_GROUP_GAMING_SESSIONS,
  endpoint
});

export const refreshGroupGamingSessions = endpoint => ({
  type: REFRESH_GROUP_GAMING_SESSIONS,
  endpoint
});

export const loadMoreGroupGamingSessions = endpoint => ({
  type: LOAD_MORE_GROUP_GAMING_SESSIONS,
  endpoint
});
