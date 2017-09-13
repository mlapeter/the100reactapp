"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import GamingSessionsList from "../../components/GamingSessionsList/GamingSessionsList";
import GamingSession from "../../components/GamingSession/GamingSession";
import User from "../../components/User/User";

const routeConfiguration = {
  GamingSessionsList: { screen: GamingSessionsList },
  GamingSession: { screen: GamingSession },
  User: { screen: User }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "GamingSessionsList"
};

export const GamingSessionsListNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
