import React, { Component } from "react";
import {
  AsyncStorage,
  Button,
  Platform,
  ScrollView,
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
import ForgotPassword from "../screens/ForgotPassword";
import AuthMainPage from "../screens/AuthMainPage";

import GamingSessionsList from "../screens/GamingSessionsList";
import GamingSession from "../screens/GamingSession";
import GamingSessionCreate from "../screens/GamingSessionCreate";
import GamingSessionEdit from "../screens/GamingSessionEdit";
import GamingSessionVisibility from "../screens/GamingSessionVisibility";

import Groups from "../screens/Groups/";
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

// For navigation, start with rootNavigator around line 170

// StackNavigators for BottomTabNavigator items

const GamingSessionsStack = createStackNavigator({
  GamingSessionsList: { screen: GamingSessionsList },
  GamingSession: { screen: GamingSession },
  Player: { screen: User },
  Group: { screen: Group },
  GroupChat: { screen: Chatroom },
  GamingSessionChat: { screen: Chatroom },
  GamingSessionCreate: { screen: GamingSessionCreate },
  GamingSessionEdit: { screen: GamingSessionEdit },
  GamingSessionVisibility: { screen: GamingSessionVisibility }
});

const GroupsStack = createStackNavigator({
  Groups: { screen: Groups },
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
  Group: { screen: Group },
  GroupChat: { screen: Chatroom },
  Conversation: { screen: Chatroom }
});

// BottomTabNavigator for bottom tab bar

const HomeTabs = createBottomTabNavigator(
  {
    Games: { screen: GamingSessionsStack },
    Groups: { screen: GroupsStack },
    NotificationsList: { screen: NotificationsStack },
    FriendsList: { screen: FriendsStack }
  },
  {
    tabBarPosition: "bottom"
  }
);

// StackNavigators for DrawerNavigator items

const UserEditStack = createStackNavigator({
  UserEdit: {
    screen: UserEdit,
    navigationOptions: ({ navigation }) => ({
      title: "Edit Profile",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />
    })
  }
});

const HelpChatStack = createStackNavigator({
  HelpChat: {
    screen: HelpChat,
    navigationOptions: ({ navigation }) => ({
      title: "Help Chat",
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />
    })
  }
});

// DrawerNavigator for side menu

const MenuDrawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: ({ navigation }) => ({
        title: "The100.io v" + Expo.Constants.manifest.version,
        drawerIcon: () => (
          <MaterialCommunityIcons name="menu" size={24} style={styles.icon} />
        )
      })
    },
    "Edit Profile": {
      screen: UserEditStack,
      navigationOptions: ({ navigation }) => ({
        drawerIcon: () => (
          <MaterialCommunityIcons
            name="account-settings-variant"
            size={24}
            style={styles.icon}
          />
        )
      })
    },
    "Help Chat": {
      screen: HelpChatStack,
      navigationOptions: ({ navigation }) => ({
        drawerIcon: () => (
          <MaterialCommunityIcons
            name="help-circle"
            size={24}
            style={styles.icon}
          />
        )
      })
    }
  },

  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: colors.white,
      inactiveTintColor: colors.white,
      // activeBackgroundColor: "#E8EAF6",
      itemsContainerStyle: {
        opacity: colors.primaryOpacity
      },
      iconContainerStyle: {
        opacity: colors.primaryOpacity
      }
    },

    // drawerBackgroundColor: colors.blue,
    backBehavior: "initialRoute",
    contentComponent: props => (
      <View style={styles.container}>
        <DrawerItems {...props} />
      </View>
    )
  }
);

// Additional Custom Menu Items
// <TouchableOpacity
//   onPress={() => {
//     navigateTo(props.navigation, "HelpChat");
//   }}
// >
//   <View style={styles.menuItem}>
//     <MaterialCommunityIcons
//       name="help-circle"
//       size={24}
//       style={styles.icon}
//     />
//     <Text style={styles.menuText}>Help Chat</Text>
//   </View>
// </TouchableOpacity>

navigateTo = (navigation, route) => {
  navigation.navigate(route);
  navigation.closeDrawer();
};
// Login/ New User stack if not already logged in

const AuthStack = createStackNavigator({
  AuthMainPage: AuthMainPage,
  Login: Login,
  ForgotPassword: ForgotPassword,
  Onboarding: { screen: OnboardingFlowStack }
});

// SwitchNavigator to initially load app and redirect to app or auth stack if no login found

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

// Screen Specific navigationOptions

Login.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  headerTitle: "",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});

ForgotPassword.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  headerTitle: "",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});

GamingSessionCreate.navigationOptions = {
  headerTitle: "New Gaming Session"
};

GamingSessionEdit.navigationOptions = {
  headerTitle: "Edit Gaming Session"
};

GamingSession.navigationOptions = {
  header: null
};

GamingSessionsList.navigationOptions = {
  header: null
};

Groups.navigationOptions = {
  header: null
};

Group.navigationOptions = {
  header: null
};

NotificationsList.navigationOptions = {
  header: null
};

FriendsList.navigationOptions = {
  header: null
};

User.navigationOptions = {
  header: null
};

AuthMainPage.navigationOptions = {
  header: null
};

OnboardingFlowStack.navigationOptions = {
  header: null
};

// Stack Navigation Options

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

GroupsStack.navigationOptions = {
  tabBarLabel: "Groups",
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
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

const BackButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButtonStyle}>
    <Text style={styles.backTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.veryDarkGrey
  },
  menuItem: {
    // padding: 15,
    marginLeft: 15,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    opacity: colors.primaryOpacity
  },
  icon: {
    width: 24,
    height: 24,
    color: colors.white
    // opacity: colors.primaryOpacity
  },
  menuText: {
    fontWeight: "bold",
    marginLeft: 30,
    color: colors.white
  },
  headerStyle: {
    backgroundColor: colors.veryDarkGrey,
    height: 60
    // paddingHorizontal: 20
  },
  headerTitleStyle: {
    color: colors.white
  },
  backButtonStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    backgroundColor: colors.darkGrey
  },
  backTitle: {
    color: colors.white
  }
});

export default rootNavigator;
