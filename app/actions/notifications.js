export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";

export const FETCH_RESULT = "FETCH_RESULT";
export const FETCH_ERROR = "FETCH_ERROR";

export const fetchNotifications = token => ({
  type: FETCH_NOTIFICATIONS,
  token: token
});
