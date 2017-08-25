"use strict";

// React
import React, { PropTypes, Component } from "react";
import { View, Text } from "react-native";
import Splash from "../../components/Splash/Splash";
import PreSplash from "../../components/PreSplash/PreSplash";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { TabBar } from "./NavigationConfiguration";

//Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  console.log("STATE IS: " + state.authentication.isAuthenticating);

  return {
    navigationState: state.tabBar,
    authenticationState: state.authentication
  };
};

class TabBarNavigation extends React.Component {
  // console.log("isAuthed: " + this.props.authenticationState.isAuthenticating === true)
  render() {
    const { dispatch, navigationState } = this.props;
    if (this.props.authenticationState.isAuthed === false) {
      return (
        <View>
          <Text>Not Authed.</Text>
        </View>
      );
    }
    return (
      <TabBar
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
        screenProps={this.props.authenticationState}
      />
    );
  }
}

export default connect(mapStateToProps)(TabBarNavigation);
