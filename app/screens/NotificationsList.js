import React, { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchNotifications } from "../actions/notifications";
import NotificationsItem from "../components/NotificationsItem/NotificationsItem";
import TopNav from "../components/TopNav/TopNav";

import { colors, fontSizes, fontStyles, styleSheet } from "../../app/styles";

class Notifications extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    notificationsError: PropTypes.string,
    items: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  // static navigationOptions = {
  //   header: null
  // };

  componentWillMount() {
    this.fetchNotificationsData();
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
  };

  handleRefresh = () => {
    this.fetchNotificationsData();
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        </View>
      );
    } else if (this.props.items.length < 1) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={this.fetchNotificationsData}
            >
              <Text style={styles.buttonText}>
                No Notifications yet! Tap to refresh.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TopNav
          title="NOTIFICATIONS"
          user={this.props.user}
          navigation={this.props.navigation}
        />
        <FlatList
          data={this.props.items}
          renderItem={({ item }) => (
            <NotificationsItem item={item} navigation={this.props.navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.props.isLoading}
          onRefresh={this.handleRefresh}
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
  const items = state.notifications.notifications;
  const isLoading = state.notifications.isLoading;
  const user = state.authentication.user;

  return {
    items,
    isLoading,
    notificationsError: state.notifications.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(Notifications));
