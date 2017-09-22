import React, { Component, PropTypes } from "react";
import devTools from "remote-redux-devtools";
import Splash from "./screens/Splash/";
import { AlertProvider } from "./components/Alert";
import EStylesheet from "react-native-extended-stylesheet";
import Notifications from "./screens/Notifications";

import { Font } from "expo";

import { Provider } from "react-redux";
import store from "./store";
import { connect } from "react-redux";

import Navigator from "./config/routes";

EStylesheet.build({
  $blue: "#4A90E2",
  $red: "#FF6A60",
  $primary: "#4E595D",
  $secondary: "#929292",
  $border: "#E4E4E4",
  $tabPrimary: "#F7F9F9",
  $white: "#fff",
  $grey: "#2f3136",
  $mediumGrey: "rgba(79,84,92,.9)",
  $lightGrey: "#737f8d",
  $lightestGrey: "#99aab5"
});

// export default () => <Notifications />;

export default function App(props) {
  return (
    <AlertProvider>
      <Provider store={store}>
        <Splash />
      </Provider>
    </AlertProvider>
  );
}
