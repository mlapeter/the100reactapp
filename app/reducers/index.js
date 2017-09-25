import { combineReducers } from "redux";

import authentication from "./authentication";
import search from "./search";

export default combineReducers({
  authentication,
  search
});
