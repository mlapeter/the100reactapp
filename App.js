import React, { Component, PropTypes } from "react";
import AppContainer from "./app/containers/App/AppContainer";
import { Font } from "expo";

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import * as reducers from "./app/redux";
import devTools from "remote-redux-devtools";

const store = createStore(
  combineReducers(reducers),
  compose(applyMiddleware(thunk), devTools()),
  applyMiddleware(thunk)
);

export default function App(props) {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
