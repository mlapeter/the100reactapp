"use strict";

// React
import React, { PropTypes, Component } from "react";
import { ActivityIndicator, AsyncStorage, View, Text } from "react-native";
import Splash from "../../components/Splash/Splash";
import PreSplash from "../../components/PreSplash/PreSplash";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { TabBar } from "./NavigationConfiguration";

//Redux
import { connect } from "react-redux";
import { onAuthChange } from "../../redux/modules/authentication";

const mapStateToProps = state => {
  console.log("isAuthenticating IS: " + state.authentication.isAuthenticating);
  console.log("isAuthed IS: " + state.authentication.isAuthed);

  return {
    navigationState: state.tabBar,
    authenticationState: state.authentication
  };
};

class TabBarNavigation extends React.Component {
  constructor() {
    super();
    this.state = { isLoaded: false };
  }

  static propTypes = {
    authenticationState: PropTypes.object.isRequired
  };

  componentDidMount() {
    AsyncStorage.getItem("id_token").then(token => {
      this.props.dispatch(onAuthChange(token));
      this.setState({ isLoaded: true });
    });
  }

  // console.log("isAuthed: " + this.props.authenticationState.isAuthenticating === true)
  render() {
    const { dispatch, navigationState } = this.props;

    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (this.props.authenticationState.isAuthed === false) {
      return <Splash />;
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
