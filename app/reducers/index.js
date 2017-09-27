import { combineReducers } from "redux";

import authentication from "./authentication";
import search from "./search";
import notifications from "./notifications";

export default combineReducers({
  authentication,
  search,
  notifications
});
