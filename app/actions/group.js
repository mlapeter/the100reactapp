export const FETCH_GROUP = "FETCH_GROUP";
export const FETCH_GROUP_RESULT = "FETCH_GROUP_RESULT";
export const FETCH_GROUP_ERROR = "FETCH_GROUP_ERROR";
export const CHANGE_GROUP = "CHANGE_GROUP";

export const fetchGroup = () => ({
  type: FETCH_GROUP
});

export const changeSelectedGroupId = groupId => ({
  type: CHANGE_GROUP,
  groupId
});
