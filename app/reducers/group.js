import {
  FETCH_GROUP,
  FETCH_GROUP_RESULT,
  FETCH_GROUP_ERROR,
  CHANGE_GROUP
} from "../actions/group";

const initialState = {
  isLoading: false,
  group: null,
  selectedGroupId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_GROUP_RESULT:
      return {
        ...state,
        group: action.result,
        isLoading: false
      };
    case FETCH_GROUP_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    case CHANGE_GROUP:
      return {
        ...state,
        selectedGroupId: action.groupId
      };
    default:
      return state;
  }
};
