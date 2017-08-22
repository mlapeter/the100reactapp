import React, { Component, PropTypes } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
// import { connect } from 'react-redux'
import { TabNavigator } from "react-navigation";
import { StackNavigator } from "react-navigation";
import PreSplash from "../../components/PreSplash/PreSplash";
import Splash from "../../components/Splash/Splash";
import SplashContainer from "../../containers/Splash/SplashContainer";
import GamingSessionsList from "../../components/GamingSessionsList/GamingSessionsList";
import Group from "../../components/Group/Group";
import Notifications from "../../components/Notifications/Notifications";
import Friends from "../../components/Friends/Friends";
import GamingSession from "../../components/GamingSession/GamingSession";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles";

class HomeScreen extends React.Component {
  static propTypes = {
    // isAuthenticating: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      isAuthenticating: true
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isAuthenticating === true
          ? <Splash />
          : <GamingSessionsList />}
      </View>
    );
  }
}

const MainScreenNavigator = TabNavigator(
  {
    Home: { screen: HomeScreen },
    Games: { screen: GamingSessionsList },
    Group: { screen: Group },
    Notifications: { screen: Notifications },
    Friends: { screen: Friends }
  },
  {
    lazy: false,
    animationEnabled: true
  }
);

// AppContainer = StackNavigator({
export default (AppContainer = StackNavigator({
  Home: { screen: MainScreenNavigator },
  GamingSession: { screen: GamingSession }
}));

HomeScreen.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "home" : "home"}
      size={26}
      style={{ color: tintColor }}
    />
};

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

Friends.navigationOptions = {
  tabBarLabel: "Friends",
  tabBarIcon: ({ tintColor, focused }) =>
    <MaterialCommunityIcons
      name={focused ? "account-star" : "account-star"}
      size={26}
      style={{ color: tintColor }}
    />
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  }
});

// function mapStateToProps ({authentication}) {
//   return {
//     isAuthenticating: authentication.isAuthenticating,
//   }
// }
//
// // export default connect(
// connect(
//   mapStateToProps
// )(HomeScreen)
