export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_USER_RESULT = "UPDATE_USER_RESULT";
export const UPDATE_USER_ERROR = "UPDATE_USER_ERROR";

export const FETCH_USER = "FETCH_USER";
export const FETCH_USER_RESULT = "FETCH_USER_RESULT";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";

export const FETCH_CURRENT_USER = "FETCH_CURRENT_USER";
export const FETCH_CURRENT_USER_RESULT = "FETCH_CURRENT_USER_RESULT";
export const CLEAR_CURRENT_USER = "CLEAR_CURRENT_USER";

export const FETCH_FRIENDS = "FETCH_FRIENDS";
export const FETCH_FRIENDS_RESULT = "FETCH_FRIENDS_RESULT";
export const FETCH_FRIENDS_ERROR = "FETCH_FRIENDS_ERROR";
export const FETCH_FRIENDS_NO_DATA = "FETCH_FRIENDS_NO_DATA";
export const LOAD_MORE_FRIENDS = "LOAD_MORE_FRIENDS";
export const LOAD_MORE_FRIENDS_RESULT = "LOAD_MORE_FRIENDS_RESULT";
export const CHANGE_FRIENDS_PAGE = "CHANGE_FRIENDS_PAGE";
export const REFRESH_FRIENDS = "REFRESH_FRIENDS";

export const FETCH_PENDING_FRIENDS = "FETCH_PENDING_FRIENDS";
export const FETCH_PENDING_FRIENDS_RESULT = "FETCH_PENDING_FRIENDS_RESULT";
export const FETCH_PENDING_FRIENDS_ERROR = "FETCH_PENDING_FRIENDS_ERROR";
export const FETCH_PENDING_FRIENDS_NO_DATA = "FETCH_PENDING_FRIENDS_NO_DATA";
export const LOAD_MORE_PENDING_FRIENDS = "LOAD_MORE_PENDING_FRIENDS";
export const LOAD_MORE_PENDING_FRIENDS_RESULT =
  "LOAD_MORE_PENDING_FRIENDS_RESULT";

export const CHANGE_PENDING_FRIENDS_PAGE = "CHANGE_PENDING_FRIENDS_PAGE";
export const REFRESH_PENDING_FRIENDS = "REFRESH_PENDING_FRIENDS";

export const FETCH_GROUP_MEMBERS = "FETCH_GROUP_MEMBERS";
export const FETCH_GROUP_MEMBERS_RESULT = "FETCH_GROUP_MEMBERS_RESULT";
export const FETCH_GROUP_MEMBERS_ERROR = "FETCH_GROUP_MEMBERS_ERROR";
export const FETCH_GROUP_MEMBERS_NO_DATA = "FETCH_GROUP_MEMBERS_NO_DATA";
export const LOAD_MORE_GROUP_MEMBERS = "LOAD_MORE_GROUP_MEMBERS";
export const LOAD_MORE_GROUP_MEMBERS_RESULT = "LOAD_MORE_GROUP_MEMBERS_RESULT";
export const CHANGE_GROUP_MEMBERS_PAGE = "CHANGE_GROUP_MEMBERS_PAGE";
export const REFRESH_GROUP_MEMBERS = "REFRESH_GROUP_MEMBERS";

export const fetchUser = userId => ({
  type: FETCH_USER,
  userId
});

export const fetchCurrentUser = () => ({
  type: FETCH_CURRENT_USER
});

export const updateUser = currentUser => ({
  type: UPDATE_USER,
  currentUser
});

export const clearCurrentUser = () => ({
  type: CLEAR_CURRENT_USER
});

export const fetchFriends = () => ({
  type: FETCH_FRIENDS
});

export const loadMoreFriends = () => ({
  type: LOAD_MORE_FRIENDS
});

export const changeFriendsPage = () => ({
  type: CHANGE_FRIENDS_PAGE
});

export const refreshFriends = () => ({
  type: REFRESH_FRIENDS
});

export const fetchPendingFriends = () => ({
  type: FETCH_PENDING_FRIENDS
});

export const loadMorePendingFriends = () => ({
  type: LOAD_MORE_PENDING_FRIENDS
});

export const refreshPendingFriends = () => ({
  type: REFRESH_PENDING_FRIENDS
});

export const fetchGroupMembers = () => ({
  type: FETCH_GROUP_MEMBERS
});

export const loadMoreGroupMembers = () => ({
  type: LOAD_MORE_GROUP_MEMBERS
});

export const refreshGroupMembers = () => ({
  type: REFRESH_GROUP_MEMBERS
});
