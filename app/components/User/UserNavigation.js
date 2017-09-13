"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { UserNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    navigationState: state.notificationsTab
  };
};

class UserNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <UserNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(UserNavigation);
