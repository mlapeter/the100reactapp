import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_RESULT,
  FETCH_CONVERSATIONS_ERROR
} from "../actions/conversations";

const initialState = {
  isLoading: false,
  conversations: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_CONVERSATIONS_RESULT:
      return {
        ...state,
        isLoading: false,
        conversations: action.conversations
      };
    case FETCH_CONVERSATIONS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};
