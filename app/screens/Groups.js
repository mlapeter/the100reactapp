// @flow
import * as React from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import TopNav from "../components/TopNav/TopNav";
import GroupsList from "../components/GroupsList";
import {
  type NavigationNavigatorProps,
  type NavigationScreenProp
} from "react-navigation";

type Group = {
  id: number,
  name: string,
  header_background_image_api: string
};

type User = {
  id: number
};

type GroupsProps = {
  groups: Array<Group>,
  user: User,
  isLoading: boolean,
  navigation: NavigationScreenProp<{}>
};

class Groups extends React.Component<GroupsProps> {
  componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics.hit(new PageHit("App - Groups"));
  }

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
          isLoading={this.props.isLoading}
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
