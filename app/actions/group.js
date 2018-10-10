export const FETCH_GROUP = "FETCH_GROUP";
export const FETCH_GROUP_RESULT = "FETCH_GROUP_RESULT";
export const FETCH_GROUP_ERROR = "FETCH_GROUP_ERROR";
export const FETCH_GROUP_EMPTY = "FETCH_GROUP_EMPTY";

export const CHANGE_GROUP = "CHANGE_GROUP";

export const fetchGroup = groupId => ({
  type: FETCH_GROUP,
  groupId
});

export const changeSelectedGroupId = groupId => ({
  type: CHANGE_GROUP,
  groupId
});
