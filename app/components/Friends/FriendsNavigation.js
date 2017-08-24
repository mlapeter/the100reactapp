"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { FriendsNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    navigationState: state.friendsTab
  };
};

class FriendsNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <FriendsNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(FriendsNavigation);
