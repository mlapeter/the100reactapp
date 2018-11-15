import React, { Component } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "./styles";

import { AlertProvider } from "./components/Alert";
import Navigator from "./router";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

import { YellowBox } from "react-native";
import _ from "lodash";

// Hide long timeout warning from firebase: https://github.com/firebase/firebase-js-sdk/issues/97
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

export default function App(props) {
  return (
    <Provider store={store}>
      <AlertProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.veryDarkGrey }}>
          <StatusBar backgroundColor={colors.veryDarkGrey} />
          <Navigator onNavigationStateChange={null} />
        </SafeAreaView>
      </AlertProvider>
    </Provider>
  );
}
