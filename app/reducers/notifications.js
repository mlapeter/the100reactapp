import {
  FETCH_NOTIFICATIONS,
  FETCH_RESULT,
  FETCH_ERROR
} from "../actions/notifications";

const initialState = {
  token: "",
  isLoading: false,
  refreshing: true,
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
    default:
      return state;
  }
};
