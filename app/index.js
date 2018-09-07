import React, { Component } from "react";
import { SafeAreaView } from "react-native";
// import EStylesheet from "react-native-extended-stylesheet";
import { AlertProvider } from "./components/Alert";
import Navigator from "./router";

import { Provider } from "react-redux";
import { connect } from "react-redux";
import store from "./config/store";

import { StatusBar, Platform } from "react-native";
import { useStrict, observable, action } from "mobx";
import { Provider as MobxProvider } from "mobx-react/native";
import { observer } from "mobx-react/native";
import { Images, loadIcons, createTheme } from "./components/components";
import { Font, AppLoading } from "expo";

// $FlowFixMe
const SFProTextBold = require("../fonts/SF-Pro-Text-Bold.otf");
// $FlowFixMe
const SFProTextSemibold = require("../fonts/SF-Pro-Text-Semibold.otf");
// $FlowFixMe
const SFProTextRegular = require("../fonts/SF-Pro-Text-Regular.otf");

@observer
export default class App extends React.Component<{}> {
  @observable isReady = false;
  @action
  ready() {
    this.isReady = true;
  }

  async componentDidMount(): Promise<void> {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("white");
    }
    const fonts = Font.loadAsync({
      "SFProText-Bold": SFProTextBold,
      "SFProText-Semibold": SFProTextSemibold,
      "SFProText-Regular": SFProTextRegular
    });
    const images = Images.downloadAsync();
    const icons = loadIcons();
    await Promise.all([fonts, ...images, icons]);
    this.ready();
  }

  render(): React.Node {
    return (
      <MobxProvider theme={createTheme()}>
        <Provider store={store}>
          <AlertProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <Navigator onNavigationStateChange={null} />
            </SafeAreaView>
          </AlertProvider>
        </Provider>
      </MobxProvider>
    );
  }
}
