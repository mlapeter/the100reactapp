"use strict";

// React
import React from "react";

// Navigation
import { addNavigationHelpers } from "react-navigation";
import { GroupNavigator } from "./NavigationConfiguration";

// Redux
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    navigationState: state.groupTab
  };
};

class GroupNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <GroupNavigator
        navigation={addNavigationHelpers({
          dispatch: dispatch,
          state: navigationState
        })}
      />
    );
  }
}
export default connect(mapStateToProps)(GroupNavigation);
