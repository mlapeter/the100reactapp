import * as React from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchNotifications } from "../actions/notifications";

import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import TopNav from "../components/TopNav/TopNav";
import FeedItem from "../components/FeedItem";

class Feed extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchNotifications());
    this.onboardings = { notification_type: "onboarding" };
  }

  render() {
    return (
      <View style={styles.container}>
        <TopNav
          title="Feed"
          user={this.props.user}
          navigation={this.props.navigation}
        />
        <FlatList
          data={[this.onboardings, ...this.props.notifications]}
          renderItem={({ item }) => (
            <FeedItem item={item} navigation={this.props.navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.props.isLoading}
          onRefresh={this.handleRefresh}
          ListFooterComponent={this.renderFooter}
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
  const notifications = state.notifications.notifications;
  const isLoading = state.notifications.isLoading;
  const user = state.users.currentUser;

  return {
    notifications,
    isLoading,
    notificationsError: state.notifications.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(Feed));
