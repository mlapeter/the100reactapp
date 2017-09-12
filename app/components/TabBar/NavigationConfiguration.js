import React, { Component, PropTypes } from "react";

import { TabNavigator } from "react-navigation";
// Tab-Navigators

import Splash from "../../components/Splash/Splash";
import GamingSessionsListNavigation from "../../components/GamingSessionsList/GamingSessionsListNavigation";
import GroupNavigation from "../../components/Group/GroupNavigation";
import NotificationsNavigation from "../../components/Notifications/NotificationsNavigation";
import FriendsListNavigation from "../../components/FriendsList/FriendsListNavigation";
import Chat from "../../components/Chat/Chat";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const routeConfiguration = {
  // Splash: { screen: SplashNavigation },
  GamingSessionsListNavigation: { screen: GamingSessionsListNavigation },
  GroupNavigation: { screen: GroupNavigation },
  NotificationsNavigation: { screen: NotificationsNavigation },
  FriendsListNavigation: { screen: FriendsListNavigation }
};

const tabBarConfiguration = {
  // //...other configs
  // tabBarOptions: {
  //   // tint color is passed to text and icons (if enabled) on the tab bar
  //   activeTintColor: "white",
  //   inactiveTintColor: "blue",
  //   // background color is for the tab component
  //   activeBackgroundColor: "blue",
  //   inactiveBackgroundColor: "white"
  // }
};

GamingSessionsListNavigation.navigationOptions = {
  tabBarLabel: "Games",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "gamepad-variant" : "gamepad-variant"}
      size={26}
      style={{ color: tintColor }}
    />
};

GroupNavigation.navigationOptions = {
  tabBarLabel: "Group",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "account-multiple" : "account-multiple"}
      size={26}
      style={{ color: tintColor }}
    />
};

NotificationsNavigation.navigationOptions = {
  tabBarLabel: "Notifications",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "notification-clear-all" : "notification-clear-all"}
      size={26}
      style={{ color: tintColor }}
    />
};

FriendsListNavigation.navigationOptions = {
  tabBarLabel: "Friends",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
};

export const TabBar = TabNavigator(routeConfiguration, tabBarConfiguration);

export const tabBarReducer = (state, action) => {
  if (action.type === "JUMP_TO_TAB") {
    return { ...state, index: 0 };
  } else {
    return TabBar.router.getStateForAction(action, state);
  }
};
