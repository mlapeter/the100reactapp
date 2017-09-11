import React, { Component, PropTypes } from "react";
import AppContainer from "./app/containers/App/AppContainer";
import devTools from "remote-redux-devtools";

import { Font } from "expo";

import { Provider } from "react-redux";
import store from "./app/store";

import TabBarNavigation from "./app/components/TabBar/TabBarNavigation";

export default function App(props) {
  return (
    <Provider store={store}>
      <TabBarNavigation />
    </Provider>
  );
}
