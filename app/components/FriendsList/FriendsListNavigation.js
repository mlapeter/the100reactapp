"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { FriendsListNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    navigationState: state.friendsTab
  };
};

class FriendsListNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <FriendsListNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(FriendsListNavigation);
