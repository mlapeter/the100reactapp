"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { NotificationsNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    navigationState: state.notificationsTab
  };
};

class NotificationsNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <NotificationsNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(NotificationsNavigation);
