import { combineReducers } from "redux";

import authentication from "./authentication";
import search from "./search";
import notifications from "./notifications";
import chat_messages from './chat_messages';
import users from "./users";
import group from "./group";
import gamingSessions from "./gamingSessions";

export default combineReducers({
  authentication,
  search,
  notifications,
  chat_messages,
  users,
  group,
  gamingSessions
});
