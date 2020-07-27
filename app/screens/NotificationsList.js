import React, { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";
import { Notifications } from 'expo';


import { NavigationActions } from "react-navigation";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchNotifications } from "../actions/notifications";
import NotificationsItem from "../components/NotificationsItem/NotificationsItem";
import TopNav from "../components/TopNav/TopNav";
import Card from "../components/Card";

import { colors, fontSizes, fontStyles, styleSheet } from "../../app/styles";

class NotificationsList extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    notificationsError: PropTypes.string,
    notifications: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  // static navigationOptions = {
  //   header: null
  // };

  UNSAFE_componentWillMount() {
    this.fetchNotificationsData();

    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Notifications"))
      .catch(e => console.log(e.message));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.notificationsError &&
      nextProps.notificationsError !== this.props.notificationsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.notificationsError);
    }
  }

  fetchNotificationsData = () => {
    this.props.dispatch(fetchNotifications());
    Notifications.setBadgeNumberAsync(0);
  };

  capitalize(text) {
    const capitalizedText = text.toLowerCase()
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    return capitalizedText
  }

  handleRefresh = () => {
    this.fetchNotificationsData();
  };

  renderFooter = () => {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        </View>
      );
    } else if (
      !this.props.notifications ||
      this.props.notifications.length < 1
    ) {
      return (
        <View>
          <Card onPress={this.fetchNotificationsData}>
            <Text>No Notifications yet! Tap to refresh.</Text>
          </Card>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TopNav
          title="Notifications"
          user={this.props.user}
          navigation={this.props.navigation}
        />
        <FlatList
          data={this.props.notifications}
          renderItem={({ item }) => (
            <NotificationsItem item={item} title={this.capitalize(item.notification_type)} navigation={this.props.navigation} />
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
  defaultText: {
    color: colors.white
  },
  container: {
    flex: 1,
    paddingBottom: styleSheet.spacing.small,
    backgroundColor: colors.lightGray
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  buttonWrapper: {
    padding: 10
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

export default connect(mapStateToProps)(connectAlert(NotificationsList));
