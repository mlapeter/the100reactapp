"use strict";
import { Platform } from "react-native";
import { StackNavigator } from "react-navigation";

// Screens
import GamingSessionsList from "../../components/GamingSessionsList/GamingSessionsList";
import GamingSession from "../../components/GamingSession/GamingSession";

const routeConfiguration = {
  GamingSessionsList: {
    screen: GamingSessionsList,
    navigationOptions: {
      header: null
    }
  },
  GamingSession: {
    screen: GamingSession,
    navigationOptions: {
      headerMode: Platform.OS === "ios" ? "float" : "screen"
    }
  }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  //headerMode: Platform.OS === "ios" ? "float" : "screen",
  initialRouteName: "GamingSessionsList"
};

export const GamingSessionsListNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
