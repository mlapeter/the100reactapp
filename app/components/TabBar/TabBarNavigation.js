"use strict";

// React
import React, { PropTypes, Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View,
  Text
} from "react-native";
import Splash from "../../components/Splash/Splash";
import PreSplash from "../../components/PreSplash/PreSplash";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { TabBar } from "./NavigationConfiguration";

//Redux
import { connect } from "react-redux";
import { onAuthChange } from "../../redux/modules/authentication";

import { colors } from "../../styles";

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

  render() {
    const { dispatch, navigationState } = this.props;

    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (this.props.authenticationState.isAuthed === false) {
      <View style={styles.container}>
        return <Splash />;
      </View>;
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

export default connect(mapStateToProps)(TabBarNavigation);
