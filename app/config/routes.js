import React, { Component, PropTypes } from "react";

import { TabNavigator } from "react-navigation";
import { StackNavigator } from "react-navigation";

import Splash from "../components/Splash/Splash";
import GamingSessionsList from "../components/GamingSessionsList/GamingSessionsList";
import GamingSession from "../components/GamingSession/GamingSession";

import Group from "../components/Group/Group";
import Notifications from "../components/Notifications/Notifications";
import FriendsList from "../components/FriendsList/FriendsList";
import User from "../components/User/User";
import Chat from "../components/Chat/Chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const GamingSessionsStack = StackNavigator(
  {
    GamingSessionsList: { screen: GamingSessionsList },
    GamingSession: { screen: GamingSession },
    Player: { screen: User }
  },
  {
    headerMode: "none"
  }
);

const FriendsStack = StackNavigator(
  {
    FriendsList: { screen: FriendsList },
    Friend: { screen: User }
  },
  {
    headerMode: "none"
  }
);

export default TabNavigator(
  {
    GamingSessionsList: { screen: GamingSessionsStack },
    Group: { screen: Group },
    Notifications: { screen: Notifications },
    FriendsList: { screen: FriendsStack }
  },
  {
    // cardStyle: { paddingTop: StatusBar.currentHeight },
    headerMode: "none"
  }
);

GamingSessionsList.navigationOptions = {
  tabBarLabel: "Games",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "gamepad-variant" : "gamepad-variant"}
      size={26}
      style={{ color: tintColor }}
    />
};
Group.navigationOptions = {
  tabBarLabel: "Group",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "account-multiple" : "account-multiple"}
      size={26}
      style={{ color: tintColor }}
    />
};
Notifications.navigationOptions = {
  tabBarLabel: "Notifications",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "notification-clear-all" : "notification-clear-all"}
      size={26}
      style={{ color: tintColor }}
    />
};
FriendsList.navigationOptions = {
  tabBarLabel: "Friends",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
};
