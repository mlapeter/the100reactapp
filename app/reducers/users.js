import {
  UPDATE_USER,
  UPDATE_USER_RESULT,
  UPDATE_USER_ERROR,
  FETCH_USER,
  FETCH_USER_RESULT,
  FETCH_USER_ERROR,
  FETCH_FRIENDS,
  FETCH_FRIENDS_RESULT,
  FETCH_FRIENDS_ERROR,
  FETCH_FRIENDS_NO_DATA,
  LOAD_MORE_FRIENDS,
  LOAD_MORE_FRIENDS_RESULT,
  CHANGE_FRIENDS_PAGE,
  FETCH_PENDING_FRIENDS,
  FETCH_PENDING_FRIENDS_RESULT,
  FETCH_PENDING_FRIENDS_ERROR,
  FETCH_PENDING_FRIENDS_NO_DATA,
  LOAD_MORE_PENDING_FRIENDS,
  LOAD_MORE_PENDING_FRIENDS_RESULT,
  FETCH_GROUP_MEMBERS,
  FETCH_GROUP_MEMBERS_RESULT,
  FETCH_GROUP_MEMBERS_ERROR,
  FETCH_GROUP_MEMBERS_NO_DATA,
  LOAD_MORE_GROUP_MEMBERS,
  LOAD_MORE_GROUP_MEMBERS_RESULT,
  CHANGE_GROUP_MEMBERS_PAGE
} from "../actions/users";

const initialState = {
  isUpdating: false,
  userUpdated: false,
  isLoading: false,
  refreshing: false,
  userLoading: false,
  user: {},
  friends: [],
  groupMembers: [],
  pendingFriends: [],
  moreFriendsAvailable: true,
  moreGroupMembersAvailable: true,
  morePendingFriendsAvailable: true,

  friendsPage: 1,
  groupMembersPage: 1
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        isUpdating: true,
        user: action.user
      };
    case UPDATE_USER_RESULT:
      return {
        ...state,
        isUpdating: false,
        userUpdated: true,
        user: action.result
      };
    case UPDATE_USER_ERROR:
      return {
        ...state,
        isUpdating: false,
        userUpdated: false,
        error: action.error
      };
    case FETCH_USER:
      return {
        ...state,
        userId: action.userId,
        userLoading: true
      };
    case FETCH_USER_RESULT:
      return {
        ...state,
        user: action.result,
        userLoading: false
      };
    case FETCH_USER_ERROR:
      return {
        ...state,
        error: action.error,
        userLoading: false
      };
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
    case FETCH_FRIENDS_NO_DATA:
      return {
        ...state,
        moreFriendsAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case LOAD_MORE_FRIENDS:
      return {
        ...state,
        refreshing: true
      };
    case LOAD_MORE_FRIENDS_RESULT:
      return {
        ...state,
        friends: [...state.friends, ...action.result],
        isLoading: false,
        refreshing: false
      };
    case CHANGE_FRIENDS_PAGE:
      return {
        ...state,
        friendsPage: action.page
      };
    case FETCH_PENDING_FRIENDS:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_PENDING_FRIENDS_RESULT:
      return {
        ...state,
        isLoading: false,
        pendingFriends: action.result
      };
    case FETCH_PENDING_FRIENDS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case FETCH_PENDING_FRIENDS_NO_DATA:
      return {
        ...state,
        morePendingFriendsAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case LOAD_MORE_PENDING_FRIENDS:
      return {
        ...state,
        refreshing: true
      };
    case LOAD_MORE_PENDING_FRIENDS_RESULT:
      return {
        ...state,
        pendingFriends: [...state.pendingFriends, ...action.result],
        isLoading: false,
        refreshing: false
      };
    case FETCH_GROUP_MEMBERS:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_GROUP_MEMBERS_RESULT:
      return {
        ...state,
        isLoading: false,
        groupMembers: action.result
      };
    case FETCH_GROUP_MEMBERS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case FETCH_GROUP_MEMBERS_NO_DATA:
      return {
        ...state,
        moreGroupMembersAvailable: false,
        isLoading: false,
        refreshing: false
      };
    case LOAD_MORE_GROUP_MEMBERS:
      return {
        ...state,
        refreshing: true
      };
    case LOAD_MORE_GROUP_MEMBERS_RESULT:
      return {
        ...state,
        groupMembers: [...state.groupMembers, ...action.result],
        isLoading: false,
        refreshing: false
      };
    case CHANGE_GROUP_MEMBERS_PAGE:
      return {
        ...state,
        groupMembersPage: action.page
      };
    default:
      return state;
  }
};
