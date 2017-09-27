import {
  FETCH_FRIENDS,
  FETCH_FRIENDS_RESULT,
  FETCH_FRIENDS_ERROR
} from "../actions/friends";

const initialState = {
  isLoading: false,
  friends: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FRIENDS:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_FRIENDS_RESULT:
      return {
        ...state,
        isLoading: false,
        friends: action.result
      };
    case FETCH_FRIENDS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};
