"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import Friends from "./Friends/";

const routeConfiguration = {
  Friends: { screen: Friends }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "Friends"
};

export const FriendsNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
