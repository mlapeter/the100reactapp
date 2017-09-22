import React, { Component, PropTypes } from "react";
import devTools from "remote-redux-devtools";
import Splash from "./app/components/Splash/Splash";

import { Font } from "expo";

import { Provider } from "react-redux";
import store from "./app/store";
import { connect } from "react-redux";

import Navigator from "./app/config/routes";

export default function App(props) {
  return (
    <Provider store={store}>
      <Splash />
    </Provider>
  );
}
