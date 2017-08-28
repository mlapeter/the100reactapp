"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { GamingSessionsListNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

// Icon
import Icon from "react-native-vector-icons/FontAwesome";

const mapStateToProps = state => {
  return {
    navigationState: state.gamingSessionsListTab
  };
};

class GamingSessionsListNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <GamingSessionsListNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(GamingSessionsListNavigation);
