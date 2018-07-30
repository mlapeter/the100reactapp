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
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";

import AuthLoading from "../screens/AuthLoading";
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

// StackNavigators for each bottom tab

const GamingSessionsStack = createStackNavigator({
  GamingSessionsList: { screen: GamingSessionsList },
  GamingSession: { screen: GamingSession },
  Player: { screen: User },
  GamingSessionChat: { screen: Chatroom },
  GamingSessionCreate: { screen: GamingSessionCreate },
  GamingSessionEdit: { screen: GamingSessionEdit }
});

const GroupStack = createStackNavigator({
  Group: { screen: Group },
  GroupChat: { screen: Chatroom }
});

const NotificationsStack = createStackNavigator({
  NotificationsList: { screen: NotificationsList },
  GamingSession: { screen: GamingSession }
});

const FriendsStack = createStackNavigator({
  FriendsList: { screen: FriendsList },
  Friend: { screen: User },
  Conversation: { screen: Chatroom }
});

// TabNavigator for bottom tab bar

const HomeTabs = createBottomTabNavigator(
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

// StackNavigators for each drawer menu item

const UserEditStack = createStackNavigator({
  UserEdit: {
    screen: UserEdit,
    navigationOptions: ({ navigation }) => ({
      title: "Edit Profile",
      headerLeft: (
        <HeaderBackButton
          onPress={() => navigation.navigate("GamingSessionsStack")}
        />
      )
    })
  }
});

const HelpChatStack = createStackNavigator({
  HelpChat: {
    screen: HelpChat,
    navigationOptions: ({ navigation }) => ({
      title: "Help Chat",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />
    })
  }
});

// DrawerNavigator for side menu

const MenuDrawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: ({ navigation }) => ({
        title: "Back",
        drawerIcon: () => <MaterialCommunityIcons name="home" size={24} />
      })
    },
    "Edit Profile": {
      screen: UserEditStack,
      navigationOptions: ({ navigation }) => ({
        drawerIcon: () => (
          <MaterialCommunityIcons name="account-settings-variant" size={24} />
        )
      })
    },
    "Help Chat": {
      screen: HelpChatStack,
      navigationOptions: ({ navigation }) => ({
        drawerIcon: () => (
          <MaterialCommunityIcons name="help-circle" size={24} />
        )
      })
    }
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

// navigationOptions

GamingSessionCreate.navigationOptions = {
  headerTitle: "New Gaming Session"
};

GamingSessionEdit.navigationOptions = {
  headerTitle: "Edit Gaming Session"
};

GamingSessionsList.navigationOptions = {
  header: null
};

Group.navigationOptions = {
  header: null
};

NotificationsList.navigationOptions = {
  header: null
};

GamingSessionsStack.navigationOptions = {
  tabBarLabel: "Games",
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? "ios-game-controller-b" : "ios-game-controller-b"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

GroupStack.navigationOptions = {
  header: null,
  tabBarLabel: "Group",
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account-multiple" : "account-multiple"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

NotificationsStack.navigationOptions = {
  tabBarLabel: "Notifications",
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialIcons
      name={focused ? "notifications" : "notifications"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

FriendsStack.navigationOptions = {
  tabBarLabel: "Friends",
  header: null,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

FriendsList.navigationOptions = {
  header: null
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

// const rootNavigator = createStackNavigator(
//   {
//     MainPage: { screen: MainPage },
//     Login: { screen: Login },
//     Main: { screen: MenuDrawer },
//     Onboarding: { screen: OnboardingFlowStack }
//   },
//   {
//     headerMode: "none",
//     cardStyle: {
//       // See https://github.com/react-community/react-navigation/issues/1478#issuecomment-301220017
//       paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
//       shadowColor: "transparent"
//     }
//   }
// );

const AuthStack = createStackNavigator({
  MainPage: MainPage,
  Login: Login,
  Onboarding: { screen: OnboardingFlowStack }
});

const rootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: MenuDrawer,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);

MainPage.navigationOptions = {
  header: null
};

OnboardingFlowStack.navigationOptions = {
  header: null
};

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
