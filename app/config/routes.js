import React, { Component, PropTypes } from "react";
import { Button } from "react-native";

import { TabNavigator } from "react-navigation";
import { StackNavigator } from "react-navigation";

import Login from "../screens/Login/";
import GamingSessionsList from "../screens/GamingSessionsList";
import GamingSession from "../screens/GamingSession";

import Group from "../screens/Group/";
import NotificationsList from "../screens/NotificationsList";
import FriendsList from "../screens/FriendsList";
import User from "../screens/User";
import Chat from "../components/Chat/Chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const GamingSessionsStack = StackNavigator(
  {
    GamingSessionsList: { screen: GamingSessionsList },
    GamingSession: { screen: GamingSession },
    Player: { screen: User }
  }
  // {
  //   headerMode: "none"
  // }
);

const FriendsStack = StackNavigator({
  FriendsList: {
    screen: FriendsList
  },
  Friend: {
    screen: User
  }
});

export default TabNavigator(
  {
    GamingSessionsList: { screen: GamingSessionsStack },
    Group: { screen: Group },
    NotificationsList: { screen: NotificationsList },
    FriendsList: { screen: FriendsStack }
  },
  {
    // cardStyle: { paddingTop: StatusBar.currentHeight },
    headerMode: "none"
  }
);

GamingSessionsList.navigationOptions = {
  tabBarLabel: "Games",
  header: false,
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? "ios-game-controller-b" : "ios-game-controller-b"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
Group.navigationOptions = {
  tabBarLabel: "Group",
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account-multiple" : "account-multiple"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
NotificationsList.navigationOptions = {
  tabBarLabel: "Notifications",
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "notification-clear-all" : "notification-clear-all"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
FriendsList.navigationOptions = {
  tabBarLabel: "Friends",
  header: false,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
User.navigationOptions = {
  tabBarLabel: "User",
  headerRight: <Button title="Add Friend" />,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account" : "account"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
GamingSession.navigationOptions = {
  tabBarLabel: "Games",
  headerRight: <Button title="Join Game" />,
  // headerTitle: navigation.state.params.title,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account" : "account"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};
