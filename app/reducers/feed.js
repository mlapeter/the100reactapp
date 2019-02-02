import {
  FETCH_FEED,
  FETCH_FEED_RESULT,
  FETCH_FEED_ERROR,
  FETCH_FEED_NO_DATA,
  LOAD_MORE_FEED_ITEMS,
  LOAD_MORE_FEED_ITEMS_RESULT,
  CHANGE_FEED_PAGE
} from "../actions/feed";

const initialState = {
  isLoading: false,
  feedItems: [],
  feedPage: 1,
  moreFeedItemsAvailable: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FEED:
      return {
        ...state,
        isLoading: true,
        moreFeedItemsAvailable: true
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
        isLoading: false,
        moreFeedItemsAvailable: false
      };
    case LOAD_MORE_FEED_ITEMS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_MORE_FEED_ITEMS_RESULT:
      return {
        ...state,
        feedItems: [...state.feedItems, ...action.result],
        isLoading: false
      };

    case CHANGE_FEED_PAGE:
      return {
        ...state,
        feedPage: action.page
      };
    default:
      return state;
  }
};
