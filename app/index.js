import React, { Component } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
// import EStylesheet from "react-native-extended-stylesheet";
import { colors, fontSizes, fontStyles, styleSheet } from "./styles";

import { AlertProvider } from "./components/Alert";
import Navigator from "./router";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

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
