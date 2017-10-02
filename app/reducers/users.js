import {
  FETCH_FRIENDS,
  FETCH_FRIENDS_RESULT,
  FETCH_FRIENDS_ERROR,
  FETCH_FRIENDS_NO_DATA,
  LOAD_MORE_FRIENDS,
  LOAD_MORE_FRIENDS_RESULT,
  CHANGE_FRIENDS_PAGE,
  FETCH_GROUP_MEMBERS,
  FETCH_GROUP_MEMBERS_RESULT,
  FETCH_GROUP_MEMBERS_ERROR,
  FETCH_GROUP_MEMBERS_NO_DATA,
  LOAD_MORE_GROUP_MEMBERS,
  LOAD_MORE_GROUP_MEMBERS_RESULT,
  CHANGE_GROUP_MEMBERS_PAGE
} from "../actions/users";

const initialState = {
  isLoading: false,
  refreshing: false,
  friends: [],
  groupMembers: [],
  moreFriendsAvailable: true,
  moreGroupMembersAvailable: true,
  friendsPage: 1,
  groupMembersPage: 1
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
