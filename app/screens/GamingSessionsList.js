import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AppState,
  AsyncStorage,
  FlatList,
  Keyboard,
  NetInfo,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Notifications } from "expo";
import Sentry from "sentry-expo";

import moment from "moment";
import Environment from "../config/environment";
import { registerForPushNotificationsAsync } from "../utils/expoPushNotifications";
import { Analytics, PageHit } from "expo-analytics";

import { colors, fontSizes, fontStyles, styleSheet } from "../../app/styles";
import GamingSessionsItem from "../components/GamingSessionsItem/GamingSessionsItem";
import GamingSessionsFilter from "../components/GamingSessionsFilter/GamingSessionsFilter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TopNav from "../components/TopNav/TopNav";
import Tabs from "../components/Tabs/Tabs";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchGames } from "../actions/search";
import { changeGamingSessionsPage, changePlatform } from "../actions/search";
import { updateUserPushToken } from "../actions/users";
import { removeToken } from "../actions/authentication";
import {
  fetchGamingSessions,
  refreshGamingSessions,
  loadMoreGamingSessions,
  fetchMyGamingSessions,
  refreshMyGamingSessions,
  loadMoreMyGamingSessions,
  fetchGroupGamingSessions,
  refreshGroupGamingSessions,
  loadMoreGroupGamingSessions,
  fetchRecentGamingSessions,
  refreshRecentGamingSessions,
  loadMoreRecentGamingSessions
} from "../actions/gamingSessions";

class GamingSessionsList extends PureComponent {
  static propTypes = {
    activity: PropTypes.string,
    game: PropTypes.object,
    gameId: PropTypes.number,
    notFull: PropTypes.number,
    page: PropTypes.number,
    platform: PropTypes.string,
    isLoading: PropTypes.bool,
    // refreshing: PropTypes.bool,
    moreDataAvailable: PropTypes.bool,
    gamingSessions: PropTypes.array,
    myGamingSessions: PropTypes.array,
    groupGamingSessions: PropTypes.array
  };
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
  }

  state = {
    notification: {}
  };

  componentDidMount() {
    console.log("Mounted GamingSessionsList Screen");
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Gaming Sessions List"))
      .catch(e => console.log(e.message));
    // Todo: save search settings in local storage and retrieve
    // AsyncStorage.getItem("search_platform").then(platform => {
    //   if (platform) {
    //     console.log("platform in local storage: ", platform)
    //     this.props.dispatch(changePlatform(platform));
    //   }
    // });
    this.fetchGamingSessionsData();
    // this.listenforUpdate();
    NetInfo.addEventListener("connectionChange", this.handleConnectivityChange);

    registerForPushNotificationsAsync()
      .then(token => {
        if (
          token &&
          (!this.props.user.expo_push_token ||
            this.props.user.expo_push_token !== token)
        ) {
          console.log("Updating user push token");
          this.props.dispatch(updateUserPushToken(token));
        } else if (token) {
          this.notificationSubscription = Notifications.addListener(
            this.handleNotification
          );
        }
      })
      .catch(err => {
        console.log("Push Notifications Error: ", err);
        Sentry.captureMessage("Push Notifications Error: ", err);
      });
  }

  componentWillUnmount() {
    console.log("Unmounting GamingSessionsList Screen");
    AppState.removeEventListener("change", this.checkForUpdate);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessionsError &&
      nextProps.gamingSessionsError !== this.props.gamingSessionsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.gamingSessionsError);
    }
  }

  handleConnectivityChange = connectionInfo => {
    console.log(
      "Connection type: " +
      connectionInfo.type +
      ", effectiveType: " +
      connectionInfo.effectiveType
    );
    if (connectionInfo.type == "wifi" || connectionInfo.type == "cellular") {
      // Connection good
    } else {
      this.props.alertWithType(
        "error",
        "Warning: Internet Connection Lost",
        ""
      );
      Sentry.captureMessage(
        `User has no cellular or wifi connection while using app.`
      );
    }
  };

  handleNotification = notification => {
    console.log(notification);
    if (notification.origin === "selected") {
      this.props.navigation.navigate("NotificationsList");
    } else {
      this.props.alertWithType("info", "", notification.data.message);
    }
  };

  // listenforUpdate = () => {
  //   console.log("App Version: ", Expo.Constants.manifest.version);
  //   AppState.addEventListener("change", this.checkForUpdate);
  // };
  //
  // checkForUpdate = async () => {
  //   try {
  //     const update = await Expo.Updates.checkForUpdateAsync();
  //     if (
  //       update.isAvailable &&
  //       update.manifest.version !== Expo.Constants.manifest.version
  //     ) {
  //       console.log("Updating App");
  //       this.props.alertWithType("info", "", "Updating App, please standby...");
  //       await Expo.Updates.fetchUpdateAsync();
  //       Expo.Updates.reloadFromCache();
  //     } else {
  //       console.log("No Update Found");
  //     }
  //   } catch (e) {
  //     console.log("ERROR LISTENING FOR UPDATE: ", e);
  //   }
  // };

  updateFilter() {
    console.log(this.searchUrl());
    this.props.dispatch(fetchGamingSessions(this.searchUrl()));
  }

  searchUrl() {
    let platform = this.props.platform;

    if (!this.props.platform) {
      platform = this.props.user.platform;
    }
    console.log("PLATFORM: ", platform);

    return encodeURI(
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "gaming_sessions" +
      "?q[game_id_eq]=" +
      this.props.gameId +
      "&q[platform_cont]=" +
      platform +
      "&q[category_cont]=" +
      this.props.activity +
      "&q[with_available_slots]=" +
      this.props.notFull
    );
  }

  fetchGamingSessionsData() {
    console.log("fetching all gaming sessions");
    this.props.dispatch(fetchGamingSessions(this.searchUrl()));
    this.props.dispatch(fetchMyGamingSessions());
    this.props.dispatch(fetchGroupGamingSessions());
    this.props.dispatch(fetchRecentGamingSessions());
  }

  refreshGames = () => {
    console.log("refreshGames Triggered");
    if (this.props.gamingSessionsRefreshing === false) {
      this.props.dispatch(refreshGamingSessions(this.searchUrl()));
    }
  };

  refreshMyGames = () => {
    console.log("refreshMyGames Triggered");
    if (this.props.myGamingSessionsRefreshing === false) {
      this.props.dispatch(refreshMyGamingSessions());
    }
  };

  refreshGroupGames = () => {
    console.log("refreshGroupGames Triggered");
    if (this.props.groupGamingSessionsRefreshing === false) {
      this.props.dispatch(refreshGroupGamingSessions());
    }
  };

  refreshRecentGames = () => {
    console.log("refreshRecentGames Triggered");
    if (this.props.recentGamingSessionsRefreshing === false) {
      this.props.dispatch(refreshRecentGamingSessions());
    }
  };

  loadMoreGamingSessions = () => {
    if (
      this.props.gamingSessionsRefreshing === false &&
      this.props.moreGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreGamingSessions Activated");
      this.props.dispatch(loadMoreGamingSessions(this.searchUrl()));
    }
  };

  loadMoreMyGamingSessions = () => {
    if (
      this.props.myGamingSessionsRefreshing === false &&
      this.props.moreMyGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreMyGamingSessions Activated");
      this.props.dispatch(loadMoreMyGamingSessions(this.searchUrl()));
    }
  };

  loadMoreGroupGamingSessions = () => {
    if (
      this.props.groupGamingSessionsRefreshing === false &&
      this.props.moreGroupGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreGroupGamingSessions Activated");
      this.props.dispatch(loadMoreGroupGamingSessions());
    }
  };

  loadMoreRecentGamingSessions = () => {
    if (
      this.props.recentGamingSessionsRefreshing === false &&
      this.props.moreRecentGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreRecentGamingSessions Activated");
      this.props.dispatch(loadMoreRecentGamingSessions(this.searchUrl()));
    }
  };

  gamesOnDate = (data, date) => {
    // this.uniqueDates(this.props.data);
    let games = data.filter(function (gamingSession) {
      return (
        moment(gamingSession.start_time)
          .startOf("day")
          .format("dddd MM-DD-YYYY") === date
      );
    });
    return games;
  };

  uniqueDates = array => {
    let allDates = array.map(function (item) {
      return moment(item["start_time"])
        .startOf("day")
        .format("dddd MM-DD-YYYY");
    });

    return allDates.reduce(function (result, number) {
      if (!result.includes(number)) {
        result.push(number);
      }
      return result;
    }, []);
  };

  gamingSessionsArray = data => {
    let array = this.uniqueDates(data);
    let games = array.map(date => ({
      title: date,
      data: this.gamesOnDate(data, date)
    }));
    return games;
  };

  renderFooter = () => {
    if (!this.props.moreGamingSessionsAvailable) {
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  renderGroupFooter = () => {
    if (!this.props.moreGroupGamingSessionsAvailable) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.alertView}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={colors.mediumGrey}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  renderMyFooter = () => {
    if (!this.props.moreMyGamingSessionsAvailable) {
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  renderRecentFooter = () => {
    if (!this.props.moreRecentGamingSessionsAvailable) {
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TopNav
          user={this.props.user}
          navigation={this.props.navigation}
          title={"Games"}
          newGameButton={true}
          searchButton={
            <GamingSessionsFilter updateFilter={this.updateFilter} />
          }
        />

        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Tabs>
            <View title="PUBLIC GAMES" style={styles.content}>
              <SectionList
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={{
                      ...item,
                      currentUserId: this.props.user.id
                    }}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      padding: 5,
                      paddingTop: 15,
                      backgroundColor: colors.lightGray
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(this.props.gamingSessions)}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
                ListEmptyComponent={this.renderEmpty}
                extraData={this.props.gamingSessions}
                // Getting errors using game id
                // keyExtractor={item => item.id}
                keyExtractor={(item, index) => index}
                refreshing={this.props.gamingSessionsRefreshing}
                onRefresh={this.refreshGames}
                onEndReached={this.loadMoreGamingSessions}
                onEndReachedThreshold={0.8}
              />
            </View>

            <View title="GROUP GAMES" style={styles.content}>
              <SectionList
                // data={this.props.groupGamingSessions}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={{
                      ...item,
                      currentUserId: this.props.user.id
                    }}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      padding: 5,
                      paddingTop: 15,
                      backgroundColor: colors.lightGray
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(
                  this.props.groupGamingSessions
                )}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderGroupFooter}
                ListEmptyComponent={this.renderEmpty}
                extraData={this.props}
                keyExtractor={(item, index) => index}
                refreshing={this.props.groupGamingSessionsRefreshing}
                onRefresh={this.refreshGroupGames}
                onEndReached={this.loadMoreGroupGamingSessions}
                onEndReachedThreshold={0}
              />
            </View>
            <View title="MY GAMES" style={styles.content}>
              <SectionList
                // data={this.props.myGamingSessions}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={{
                      ...item,
                      currentUserId: this.props.user.id
                    }}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      padding: 5,
                      paddingTop: 15,
                      backgroundColor: colors.lightGray
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(
                  this.props.myGamingSessions
                )}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderMyFooter}
                extraData={this.props.myGamingSessions}
                keyExtractor={(item, index) => index}
                refreshing={this.props.myGamingSessionsRefreshing}
                onRefresh={this.refreshMyGames}
                onEndReached={this.loadMoreMyGamingSessions}
                onEndReachedThreshold={0}
              />
            </View>
            <View title="RECENT GAMES" style={styles.content}>
              <SectionList
                // data={this.props.myGamingSessions}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={{
                      ...item,
                      currentUserId: this.props.user.id
                    }}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      padding: 5,
                      paddingTop: 15,
                      backgroundColor: colors.lightGray
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(
                  this.props.recentGamingSessions
                )}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderRecentFooter}
                extraData={this.props.recentGamingSessions}
                keyExtractor={(item, index) => index}
                refreshing={this.props.recentGamingSessionsRefreshing}
                onRefresh={this.refreshRecentGames}
                onEndReached={this.loadMoreRecentGamingSessions}
                onEndReachedThreshold={0}
              />
            </View>
          </Tabs>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: styleSheet.spacing.small,
    backgroundColor: colors.lightGray
  },
  content: {
    flex: 1,
    backgroundColor: colors.lightGray
  },
  alertView: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50
  }
});

const mapStateToProps = state => {
  const activity = state.search.activity;
  const gameId = state.search.gameId;
  // const game = state.search.games[gameId] || {};
  const notFull = state.search.notFull;
  const platform = state.search.platform;

  const gamingSessionsRefreshing =
    state.gamingSessions.gamingSessionsRefreshing;
  const groupGamingSessionsRefreshing =
    state.gamingSessions.groupGamingSessionsRefreshing;
  const myGamingSessionsRefreshing =
    state.gamingSessions.myGamingSessionsRefreshing;
  const recentGamingSessionsRefreshing =
    state.gamingSessions.recentGamingSessionsRefreshing;

  const moreDataAvailable = state.gamingSessions.moreDataAvailable;
  const gamingSessions = state.gamingSessions.gamingSessions;
  const myGamingSessions = state.gamingSessions.myGamingSessions;
  const groupGamingSessions = state.gamingSessions.groupGamingSessions;
  const recentGamingSessions = state.gamingSessions.recentGamingSessions;

  const moreGamingSessionsAvailable =
    state.gamingSessions.moreGamingSessionsAvailable;
  const moreMyGamingSessionsAvailable =
    state.gamingSessions.moreMyGamingSessionsAvailable;
  const moreGroupGamingSessionsAvailable =
    state.gamingSessions.moreGroupGamingSessionsAvailable;
  const moreRecentGamingSessionsAvailable =
    state.gamingSessions.moreRecentGamingSessionsAvailable;
  const user = state.users.currentUser;
  const gamingSessionsError = state.gamingSessions.error;

  return {
    activity,
    // game,
    gameId,
    platform,
    notFull,
    moreDataAvailable,
    user,

    gamingSessionsRefreshing,
    myGamingSessionsRefreshing,
    groupGamingSessionsRefreshing,
    recentGamingSessionsRefreshing,

    gamingSessions,
    myGamingSessions,
    groupGamingSessions,
    recentGamingSessions,

    moreGamingSessionsAvailable,
    moreMyGamingSessionsAvailable,
    moreGroupGamingSessionsAvailable,
    moreRecentGamingSessionsAvailable,

    gamingSessionsError
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionsList));
