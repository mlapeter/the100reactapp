"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import User from "./Notifications/";

const routeConfiguration = {
  User: { screen: User }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "Notifications"
};

export const UserNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
