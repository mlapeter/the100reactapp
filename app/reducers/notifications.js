import {
  FETCH_NOTIFICATIONS,
  FETCH_RESULT,
  FETCH_ERROR
} from "../actions/notifications";

const initialState = {
  token: "",
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
    case FETCH_RESULT:
      return {
        ...state,
        notifications: action.result,
        isLoading: false
      };
    case FETCH_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    default:
      return state;
  }
};
