// @flow
import * as React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
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
  // groups: Array<Group>,
  user: User,
  navigation: NavigationScreenProp<{}>
};

class Groups extends React.Component<GroupsProps> {
  componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Groups"))
      .catch(e => console.log(e.message));
  }

  render() {
    return (
      <View style={styles.container}>
        <TopNav
          title="Groups"
          user={this.props.user}
          navigation={this.props.navigation}
        />
        {this.props.user.groups ? (
          <GroupsList
            groups={this.props.user.groups}
            navigation={this.props.navigation}
          />
        ) : (
          <Text>
            You haven't joined any groups yet! You can join any group you like
            by tapping the join icon at the top right of the group page.
          </Text>
        )}
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
  // const groups = state.users.currentUser.groups;
  // const isLoading = state.group.isLoading;
  const user = state.users.currentUser;

  return {
    // groups,
    // isLoading,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(Groups));
