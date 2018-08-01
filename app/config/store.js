require("./reactotron");

import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import Reactotron from "reactotron-react-native";

import reducers from "../reducers";
import rootSaga from "./sagas";

let sagaMonitor;
let sagaMiddleware;

if (process.env.NODE_ENV === "development") {
  // middleware.push(logger);
  sagaMonitor = Reactotron.createSagaMonitor();
  sagaMiddleware = createSagaMiddleware({ sagaMonitor });
} else {
  sagaMiddleware = createSagaMiddleware();
}

const middleware = [sagaMiddleware];

const store = createStore(reducers, applyMiddleware(...middleware));

sagaMiddleware.run(rootSaga);

export default store;
