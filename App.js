import React, { Component, PropTypes } from "react";
import AppContainer from "./app/containers/App/AppContainer";
import devTools from "remote-redux-devtools";
import { AsyncStorage, Button, StyleSheet, Text, View } from "react-native";
import { colors } from "./app/styles";

import { Font } from "expo";

import { Provider } from "react-redux";
import store from "./app/store";

import TabBarNavigation from "./app/components/TabBar/TabBarNavigation";

export default function App(props) {
  return (
    <Provider store={store} style={styles.container}>
      {/* <AppContainer /> */}
      <TabBarNavigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  }
});
