import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_RESULT,
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_NOTIFICATIONS_NO_DATA
} from "../actions/notifications";

const initialState = {
  isLoading: false,
  notifications: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_NOTIFICATIONS_RESULT:
      return {
        ...state,
        notifications: action.result,
        isLoading: false
      };
    case FETCH_NOTIFICATIONS_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    case FETCH_NOTIFICATIONS_NO_DATA:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};
