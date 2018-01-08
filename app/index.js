import React, { Component } from "react";
// import EStylesheet from "react-native-extended-stylesheet";
import MainPage from "./screens/MainPage";
import { AlertProvider } from "./components/Alert";
import Navigator from "./router";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

export default function App(props) {
  return (
    <Provider store={store}>
      <AlertProvider>
        <Navigator onNavigationStateChange={null} />
      </AlertProvider>
    </Provider>
  );
}
