import React, { Component } from "react";
import { SafeAreaView } from "react-native";
// import EStylesheet from "react-native-extended-stylesheet";
import { AlertProvider } from "./components/Alert";
import Navigator from "./router";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

export default function App(props) {
  return (
    <Provider store={store}>
      <AlertProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Navigator onNavigationStateChange={null} />
        </SafeAreaView>
      </AlertProvider>
    </Provider>
  );
}
