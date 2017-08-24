"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import Group from "./Group/";

const routeConfiguration = {
  Group: { screen: Group }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "Group"
};

export const GroupNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
