import {
  FETCH_CHAT_MESSAGES,
  FETCH_CHAT_MESSAGES_RESULT,
  FETCH_CHAT_MESSAGES_ERROR
} from "../actions/chat_messages";

const initialState = {
  isLoading: false,
  chat_messages: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHAT_MESSAGES:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_CHAT_MESSAGES_RESULT:
      return {
        ...state,
        chat_messages: action.result,
        isLoading: false
      };
    case FETCH_CHAT_MESSAGES_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    default:
      return state;
  }
};
