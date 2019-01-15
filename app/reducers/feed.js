import {
  FETCH_FEED,
  FETCH_FEED_RESULT,
  FETCH_FEED_ERROR,
  FETCH_FEED_NO_DATA
} from "../actions/feed";

const initialState = {
  isLoading: false,
  feedItems: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FEED:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_FEED_RESULT:
      return {
        ...state,
        feedItems: action.result,
        isLoading: false
      };
    case FETCH_FEED_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    case FETCH_FEED_NO_DATA:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};
