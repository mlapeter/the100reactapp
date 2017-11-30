export const FETCH_CHAT_MESSAGES = "FETCH_CHAT_MESSAGES";
export const FETCH_CHAT_MESSAGES_RESULT = "FETCH_CHAT_MESSAGES_RESULT";
export const FETCH_CHAT_MESSAGES_ERROR = "FETCH_CHAT_MESSAGES_ERROR";
export const ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE";
export const EDIT_CHAT_MESSAGE = "EDIT_CHAT_MESSAGE";
export const REMOVE_CHAT_MESSAGE = "REMOVE_CHAT_MESSAGE";

export const fetchChatMessages = (chatId, firstCreatedAt = null) => ({
  type: FETCH_CHAT_MESSAGES,
  chatId: chatId,
  firstCreatedAt: firstCreatedAt
});

export const addChatMessage = (chatId, message) => ({
  type: ADD_CHAT_MESSAGE,
  chatId: chatId,
  message: message
});

export const editChatMessage = (chatId, message) => ({
  type: EDIT_CHAT_MESSAGE,
  chatId: chatId,
  message: message
});

export const removeChatMessage = (chatId, message) => ({
  type: REMOVE_CHAT_MESSAGE,
  chatId: chatId,
  message: message
});
