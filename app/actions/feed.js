export const FETCH_FEED = "FETCH_FEED";
export const FETCH_FEED_RESULT = "FETCH_FEED_RESULT";
export const FETCH_FEED_ERROR = "FETCH_FEED_ERROR";
export const FETCH_FEED_NO_DATA = "FETCH_FEED_NO_DATA";
export const LOAD_MORE_FEED_ITEMS = "LOAD_MORE_FEED_ITEMS";
export const LOAD_MORE_FEED_ITEMS_RESULT = "LOAD_MORE_FEED_ITEMS_RESULT";
export const CHANGE_FEED_PAGE = "CHANGE_FEED_PAGE";

export const fetchFeed = () => ({
  type: FETCH_FEED
});

export const loadMoreFeedItems = () => ({
  type: LOAD_MORE_FEED_ITEMS
});
