import React, { Component } from "react";
// import EStylesheet from "react-native-extended-stylesheet";
import Login from "./screens/Login/";
import { AlertProvider } from "./components/Alert";
import Navigator from "./config/routes";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

export default function App(props) {
  return (
    <Provider store={store}>
      <AlertProvider>
        <Login />
      </AlertProvider>
    </Provider>
  );
}
