import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";

import reducers from "../reducers";

const middleware = [];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const store = createStore(reducers, applyMiddleware(...middleware));

export default store;
