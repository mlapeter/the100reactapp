import React, { Component } from "react";
import {
  AsyncStorage,
  Button,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import hoistNonReactStatics from "hoist-non-react-statics";
import {
  TabNavigator,
  StackNavigator,
  DrawerNavigator
} from "react-navigation";

import OnboardingFlowStack from "./onboarding-flow";
import Login from "../screens/Login";
import MainPage from "../screens/MainPage";

import GamingSessionsList from "../screens/GamingSessionsList";
import GamingSession from "../screens/GamingSession";
import GamingSessionCreate from "../screens/GamingSessionCreate";
import GamingSessionEdit from "../screens/GamingSessionEdit";

import Group from "../screens/Group/";
import NotificationsList from "../screens/NotificationsList";
import FriendsList from "../screens/FriendsList";
import User from "../screens/User";
import UserEdit from "../screens/UserEdit";
import HelpChat from "../screens/HelpChat";

import Menu from "../screens/Menu";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, fontSizes } from "../styles";
import { HeaderBackButton, DrawerItems } from "react-navigation";
import { connect } from "react-redux";
import Chatroom from "../screens/Chatroom";

const GamingSessionsStack = StackNavigator({
  GamingSessionsList: { screen: GamingSessionsList },
  GamingSession: { screen: GamingSession },
  Player: { screen: User },
  GamingSessionChat: {
    screen: Chatroom,
    navigationOptions: {
      tabBarLabel: "Games"
    }
  },
  GamingSessionCreate: { screen: GamingSessionCreate },
  GamingSessionEdit: { screen: GamingSessionEdit }
});

const GroupStack = StackNavigator({
  Group: {
    screen: Group,
    navigationOptions: { header: null }
  },
  GroupChat: {
    screen: Chatroom,
    navigationOptions: {
      tabBarLabel: "Group"
    }
  }
});

const UserEditStack = StackNavigator({
  UserEdit: {
    screen: UserEdit,
    navigationOptions: ({ navigation }) => ({
      title: "Edit Profile",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      drawerIcon: () => (
        <MaterialCommunityIcons
          name="account-settings-variant"
          size={24}
          // style={{ color: colors.grey }}
        />
      )
    })
  }
});

const HelpChatStack = StackNavigator({
  HelpChat: {
    screen: HelpChat,
    navigationOptions: ({ navigation }) => ({
      title: "Help Chat",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      drawerIcon: () => (
        <MaterialCommunityIcons
          name="help-circle"
          size={24}
          // style={{ color: colors.grey }}
        />
      )
    })
  }
});

const FriendsStack = StackNavigator({
  FriendsList: { screen: FriendsList },
  Friend: { screen: User },
  Conversation: {
    screen: Chatroom,
    navigationOptions: {
      tabBarLabel: "User"
    }
  }
});

const NotificationsStack = StackNavigator({
  NotificationsList: { screen: NotificationsList },
  GamingSession: {
    screen: GamingSession,
    navigationOptions: ({ navigation }) => ({
      // title: "the game",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      tabBarLabel: "Notifications",
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
          name={focused ? "notifications" : "notifications"}
          size={26}
          style={{ color: tintColor }}
        />
      )
    })
  }
});

const HomeTabs = TabNavigator(
  {
    Games: { screen: GamingSessionsStack },
    Group: { screen: GroupStack },
    NotificationsList: { screen: NotificationsStack },
    FriendsList: { screen: FriendsStack }
  },
  {
    tabBarPosition: "bottom"
  }
);

const MenuDrawer = DrawerNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: ({ navigation }) => ({
        title: "Back",
        drawerIcon: () => (
          <MaterialCommunityIcons
            name="home"
            size={24}
            // style={{ color: colors.grey }}
          />
        )
      })
    },
    "Edit Profile": { screen: UserEditStack },
    "Help Chat": { screen: HelpChatStack }
  },
  {
    contentComponent: props => (
      <View style={styles.container}>
        <DrawerItems {...props} />

        <View style={styles.menuItem}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            style={styles.icon}
          />
          <Text style={styles.menuText}>More Coming Soon</Text>
        </View>
      </View>
    )
  }
);

GamingSessionCreate.navigationOptions = {
  headerTitle: "New Gaming Session",
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? "ios-game-controller-b" : "ios-game-controller-b"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

GamingSessionEdit.navigationOptions = {
  headerTitle: "Edit Gaming Session",
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? "ios-game-controller-b" : "ios-game-controller-b"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

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
  header: false,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialIcons
      name={focused ? "notifications" : "notifications"}
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
  // headerRight: <Button title="Add Friend" />,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account" : "account"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

GamingSession.navigationOptions = {
  // tabBarLabel: "Notifications",
  // headerRight: <Button title="Join Game" />,
  // headerTitle: navigation.state.params.title,
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? "ios-game-controller-b" : "ios-game-controller-b"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

const rootNavigator = StackNavigator(
  {
    MainPage: { screen: MainPage },
    Login: { screen: Login },
    Main: { screen: MenuDrawer },
    Onboarding: { screen: OnboardingFlowStack }
  },
  {
    headerMode: "none",
    cardStyle: {
      // See https://github.com/react-community/react-navigation/issues/1478#issuecomment-301220017
      paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
      shadowColor: "transparent"
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  menuItem: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  icon: {
    marginRight: 25,
    width: 24,
    height: 24,
    color: colors.grey
  },
  menuText: {
    fontWeight: "bold",
    marginLeft: 6
    // textAlign: "center"
  }
});

export default rootNavigator;
