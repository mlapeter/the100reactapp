import { combineReducers } from "redux";

import authentication from "./authentication";
import search from "./search";
import notifications from "./notifications";
import friends from "./friends";

export default combineReducers({
  authentication,
  search,
  notifications,
  friends
});
