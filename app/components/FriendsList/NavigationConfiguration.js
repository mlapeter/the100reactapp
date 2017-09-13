"use strict";

import { StackNavigator } from "react-navigation";

// Screens
import FriendsList from "./FriendsList/";
import User from "../../components/User/User";

const routeConfiguration = {
  FriendsList: { screen: FriendsList },
  User: { screen: User }
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
