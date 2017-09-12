"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import FriendsList from "./FriendsList/";

const routeConfiguration = {
  FriendsList: { screen: FriendsList }
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: "none",
  initialRouteName: "FriendsList"
};

export const FriendsListNavigator = StackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);
