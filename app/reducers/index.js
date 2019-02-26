import { combineReducers } from "redux";

import authentication from "./authentication";
import search from "./search";
import notifications from "./notifications";
import users from "./users";
import group from "./group";
import gamingSessions from "./gamingSessions";
import onboarding from "./onboarding";
import conversations from "./conversations";
import feed from "./feed";

export default combineReducers({
  authentication,
  search,
  notifications,
  users,
  group,
  gamingSessions,
  onboarding,
  conversations,
  feed
});
