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

import {
  TabNavigator,
  StackNavigator,
  DrawerNavigator
} from "react-navigation";

import OnboardingFlowStack from "./onboarding-flow";
import Login from "../screens/Login/";
import MainPage from "../screens/MainPage/";

import GamingSessionsList from "../screens/GamingSessionsList";
import GamingSession from "../screens/GamingSession";
import GamingSessionCreate from "../screens/GamingSessionCreate";

import Group from "../screens/Group/";
import NotificationsList from "../screens/NotificationsList";
import FriendsList from "../screens/FriendsList";
import User from "../screens/User";
import UserEdit from "../screens/UserEdit";
import HelpChat from "../screens/HelpChat/";

import Menu from "../screens/Menu";

import Chat from "../components/Chat/Chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, fontSizes } from "../styles";
import { DrawerItems } from "react-navigation";
import { connect } from "react-redux";
import { userLogout } from "../screens/NotificationsList";

const GamingSessionsStack = StackNavigator({
  GamingSessionsList: { screen: GamingSessionsList },
  GamingSession: { screen: GamingSession },
  Player: { screen: User },
  GamingSessionCreate: { screen: GamingSessionCreate }
});

const UserEditStack = StackNavigator({
  UserEdit: { screen: UserEdit }
});

const HelpChatStack = StackNavigator({
  HelpChat: { screen: HelpChat }
});

const FriendsStack = StackNavigator({
  FriendsList: { screen: FriendsList },
  Friend: { screen: User }
});

const HomeTabs = TabNavigator(
  {
    Games: { screen: GamingSessionsStack },
    Group: { screen: Group },
    NotificationsList: { screen: NotificationsList },
    FriendsList: { screen: FriendsStack }
  },
  {
    // headerMode: "none"
  }
);

const MenuDrawer = DrawerNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: ({ navigation }) => ({
        headerTitle: "Home",
        drawerLabel: "Home"
      })
    },
    "Edit Profile": { screen: UserEditStack },
    "Help Chat": { screen: HelpChatStack }
  },
  {
    contentComponent: props => (
      <View style={styles.container}>
        <DrawerItems {...props} />
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => userLogout()}
        >
          <View style={styles.menuItem}>
            <MaterialCommunityIcons
              name="account-remove"
              size={24}
              style={styles.icon}
            />
            <Text style={styles.menuText}>Log Out</Text>
          </View>
        </TouchableOpacity>
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

UserEdit.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Button title="Cancel" onPress={() => navigation.navigate("Home")} />
  ),
  headerTitle: "Edit Profile",
  drawerLabel: "Edit Profile",
  drawerIcon: () => (
    <MaterialCommunityIcons
      name="account-settings-variant"
      size={24}
      // style={{ color: colors.grey }}
    />
  )
});

HelpChat.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Button title="Back" onPress={() => navigation.navigate("Home")} />
  ),
  headerTitle: "Help Chat",
  drawerLabel: "Help Chat",
  drawerIcon: () => (
    <MaterialCommunityIcons
      name="help-circle"
      size={24}
      // style={{ color: colors.grey }}
    />
  )
});

GamingSessionsStack.navigationOptions = {
  drawerLabel: "",
  drawerIcon: () => (
    <MaterialCommunityIcons
      name="arrow-left"
      size={24}
      // style={{ color: colors.grey }}
    />
  )
};

GamingSessionCreate.navigationOptions = {
  // headerRight: <Button title="Join Game" />,
  headerTitle: "New Gaming Session"
};

MenuDrawer.navigationOptions = {
  tabBarLabel: "Games",
  // header: false,
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
  tabBarLabel: "Games",
  // headerRight: <Button title="Join Game" />,
  // headerTitle: navigation.state.params.title,
  tabBarIcon: ({ tintColor, focused }) => (
    <MaterialCommunityIcons
      name={focused ? "account" : "account"}
      size={26}
      style={{ color: tintColor }}
    />
  )
};

const rootNavigator = StackNavigator(
  {
    MainPage: { screen: MainPage },
    LoginPage: { screen: Login },
    Main: { screen: MenuDrawer },
    Onboarding: { screen: OnboardingFlowStack }
  },
  {
    headerMode: "none",
    cardStyle: {
      // See https://github.com/react-community/react-navigation/issues/1478#issuecomment-301220017
      paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
    }
  }
);
// const prevGetStateForActionHomeStack = rootNavigator.router.getStateForAction;
// rootNavigator.router.getStateForAction = (action, state) => {
//   if (state && action.type === "ReplaceCurrentScreen") {
//     console.log("routes===>", state.routes);
//     const routes = state.routes.slice(0, state.routes.length - 1);
//     routes.push(action);
//     return {
//       ...state,
//       routes,
//       index: routes.length - 1
//     };
//   }
//   return prevGetStateForActionHomeStack(action, state);
// };

const styles = StyleSheet.create({
  container: {
    flex: 1
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
