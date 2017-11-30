import { merge, omit } from "lodash";

import {
  FETCH_CHAT_MESSAGES,
  FETCH_CHAT_MESSAGES_RESULT,
  FETCH_CHAT_MESSAGES_ERROR,
  ADD_CHAT_MESSAGE,
  EDIT_CHAT_MESSAGE,
  REMOVE_CHAT_MESSAGE
} from "../actions/chat_messages";

const initialState = {
  isLoading: false,
  chat_messages: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHAT_MESSAGES:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_CHAT_MESSAGES_RESULT:
      return merge({}, state, {
        chat_messages: {
          [action.chatId]: {
            ...action.result
          }
        }
      });
    case FETCH_CHAT_MESSAGES_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    case ADD_CHAT_MESSAGE: // Intentional fall-through
    case EDIT_CHAT_MESSAGE:
      return merge({}, state, {
        chat_messages: {
          [action.chatId]: {
            [action.message.id]: action.message
          }
        }
      });
    case REMOVE_CHAT_MESSAGE:
      return omit(
        state,
        `chat_messages["${action.chatId}"]["${action.message.id}"]`
      );
    default:
      return state;
  }
};
