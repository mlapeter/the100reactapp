"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import Notifications from "./Notifications/";

const routeConfiguration = {
  Notifications: { screen: Notifications }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "Notifications"
};

export const NotificationsNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
