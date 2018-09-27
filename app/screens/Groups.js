// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import TopNav from "../components/TopNav/TopNav";
import GroupsList from "../components/GroupsList";

type GroupsProps = {
  name?: string
};

class Groups extends React.Component<GroupsProps<>> {
  render() {
    return (
      <View style={styles.container}>
        <TopNav
          title="Groups"
          user={this.props.user}
          navigation={this.props.navigation}
        />

        <GroupsList
          groups={this.props.groups}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: styleSheet.spacing.small,
    backgroundColor: colors.lightGray
  }
});

const mapStateToProps = state => {
  const groups = state.users.currentUser.groups;
  const isLoading = state.group.isLoading;
  const user = state.authentication.user;

  return {
    groups,
    isLoading,
    groupsError: state.group.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(Groups));
