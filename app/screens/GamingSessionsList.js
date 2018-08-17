import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  Keyboard,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Notifications } from "expo";

import moment from "moment";
import Environment from "../config/environment";
import { registerForPushNotificationsAsync } from "../utils/expoPushNotifications";

import { colors, fontSizes } from "../styles";
import PreSplash from "../components/PreSplash/PreSplash";
import GamingSessionsItem from "../components/GamingSessionsItem/GamingSessionsItem";
import GamingSessionsFilter from "../components/GamingSessionsFilter/GamingSessionsFilter";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { Icon } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import Tabs from "../components/Tabs/Tabs";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

import { fetchGames } from "../actions/search";
import { changeGamingSessionsPage, changePlatform } from "../actions/search";

import { fetchGamingSessions } from "../actions/gamingSessions";
import { refreshGamingSessions } from "../actions/gamingSessions";

import { loadMoreGamingSessions } from "../actions/gamingSessions";
import { fetchMyGamingSessions } from "../actions/gamingSessions";
import { refreshMyGamingSessions } from "../actions/gamingSessions";
import { loadMoreMyGamingSessions } from "../actions/gamingSessions";

import { fetchGroupGamingSessions } from "../actions/gamingSessions";
import { refreshGroupGamingSessions } from "../actions/gamingSessions";
import { loadMoreGroupGamingSessions } from "../actions/gamingSessions";
import { updateUser } from "../actions/users";
import { removeToken } from "../actions/authentication";

class GamingSessionsList extends React.PureComponent {
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
    data: PropTypes.array,
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

  // static navigationOptions = {
  //   header: null
  // };

  componentDidMount() {
    // this.fetchGamesData();

    // Todo: save search settings in local storage and retrieve
    // AsyncStorage.getItem("search_platform").then(platform => {
    //   if (platform) {
    //     console.log("platform in local storage: ", platform)
    //     this.props.dispatch(changePlatform(platform));
    //   }
    // });

    if (this.props.user.platform == null) {
      setTimeout(() => {
        // Wait to load user to get user platform for default search
        this.fetchGamingSessionsData();
      }, 3000);
    } else {
      this.fetchGamingSessionsData();
    }

    registerForPushNotificationsAsync().then(token => {
      if (
        token &&
        (this.props.user.expo_push_token == null ||
          this.props.user.expo_push_token !== token)
      ) {
        this.props.dispatch(updateUser(token));
      }
      this._notificationSubscription = Notifications.addListener(
        this._handleNotification
      );
    });
    Notifications.setBadgeNumberAsync(0);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessionsError &&
      nextProps.gamingSessionsError !== this.props.gamingSessionsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.gamingSessionsError);
    }
  }

  _handleNotification = notification => {
    console.log(notification);
    if (notification.origin === "selected") {
      this.props.navigation.navigate("NotificationsList");
    } else {
      this.props.alertWithType("info", "", notification.data.message);
    }
  };

  fetchGamesData() {
    this.props.dispatch(fetchGames());
  }

  updateFilter() {
    console.log(this.searchUrl());
    this.props.dispatch(fetchGamingSessions(this.searchUrl()));
  }

  searchUrl() {
    return encodeURI(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "gaming_sessions" +
        // this.props.gamingSessionsPage +
        "?q[game_id_eq]=" +
        this.props.gameId +
        "&q[platform_cont]=" +
        this.props.platform +
        "&q[category_cont]=" +
        this.props.activity +
        "&q[with_available_slots]=" +
        this.props.notFull
    );
  }

  fetchGamingSessionsData() {
    this.props.dispatch(fetchGamingSessions(this.searchUrl()));
    this.props.dispatch(fetchMyGamingSessions());
    this.props.dispatch(fetchGroupGamingSessions());
  }

  refreshGames = () => {
    console.log("refreshGames Triggered");
    if (this.props.gamingSessionsRefreshing === false) {
      this.props.dispatch(refreshGamingSessions(this.searchUrl()));
    }
  };

  refreshMyGames = () => {
    console.log("refreshMyGames Triggered");
    this.props.dispatch(refreshMyGamingSessions());

    // if (this.props.myGamingSessionsRefreshing === false) {
    //   this.props.dispatch(refreshMyGamingSessions());
    // }
  };

  refreshGroupGames = () => {
    console.log("refreshGroupGames Triggered");
    if (this.props.groupGamingSessionsRefreshing === false) {
      this.props.dispatch(refreshGroupGamingSessions());
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

  loadMoreGroupGamingSessions = () => {
    if (
      this.props.groupGamingSessionsRefreshing === false &&
      this.props.moreGroupGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreGroupGamingSessions Activated");
      this.props.dispatch(loadMoreGroupGamingSessions());
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

  gamesOnDate = (data, date) => {
    // this.uniqueDates(this.props.data);
    let games = data.filter(function(gamingSession) {
      return (
        moment(gamingSession.start_time)
          .startOf("day")
          .format("dddd MM-DD-YYYY") === date
      );
    });
    return games;
  };

  uniqueDates = array => {
    let allDates = array.map(function(item) {
      return moment(item["start_time"])
        .startOf("day")
        .format("dddd MM-DD-YYYY");
    });

    return allDates.reduce(function(result, number) {
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

  render() {
    // if (this.props.gamingSessionsRefreshing) {
    //   return (
    //     <View style={styles.container}>
    //       <PreSplash />
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              {this.props.user ? (
                <Image
                  style={styles.avatarMini}
                  source={
                    this.props.user.computed_avatar_api ===
                    "img/default-avatar.png"
                      ? require("../../app/assets/images/default-avatar.png")
                      : { uri: this.props.user.computed_avatar_api }
                  }
                />
              ) : (
                <ActivityIndicator />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.searchOptions}>
              <GamingSessionsFilter updateFilter={this.updateFilter} />
            </View>
            <View style={styles.newButton}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("GamingSessionCreate")}
              >
                <MaterialIcons
                  name="add-box"
                  size={28}
                  style={{
                    color: colors.mediumGrey
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={{ padding: 5, backgroundColor: "white" }}>
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(this.props.data)}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
                // ListEmptyComponent={this.renderEmpty}
                extraData={this.props}
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
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={{ padding: 5, backgroundColor: "white" }}>
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
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: "white"
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                  </View>
                )}
                sections={this.gamingSessionsArray(this.props.myGamingSessions)}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderMyFooter}
                extraData={this.props}
                keyExtractor={(item, index) => index}
                refreshing={this.props.myGamingSessionsRefreshing}
                onRefresh={this.refreshMyGames}
                onEndReached={this.loadMoreMyGamingSessions}
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
    padding: 5,
    // paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  leftContainer: {},
  rightContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  newButton: {
    paddingHorizontal: 10
  },
  searchOptions: {
    paddingHorizontal: 10
  },
  avatarMini: {
    marginBottom: 6,
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  content: {
    flex: 1,
    backgroundColor: colors.white
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
  const game = state.search.games[gameId] || {};
  const notFull = state.search.notFull;
  const platform = state.search.platform || state.users.currentUser.platform;

  // const gamingSessionsLoading = state.gamingSessions.gamingSessionsLoading;
  // const myGamingSessionsLoading = state.gamingSessions.myGamingSessionsLoading;
  // const groupGamingSessionsLoading =
  //   state.gamingSessions.groupGamingSessionsLoading;
  const gamingSessionsRefreshing =
    state.gamingSessions.gamingSessionsRefreshing;
  const groupGamingSessionsRefreshing =
    state.gamingSessions.groupGamingSessionsRefreshing;
  const myGamingSessionsRefreshing =
    state.gamingSessions.myGamingSessionsRefreshing;

  // const refreshing = state.gamingSessions.refreshing;
  const moreDataAvailable = state.gamingSessions.moreDataAvailable;
  const data = state.gamingSessions.gamingSessions;
  const myGamingSessions = state.gamingSessions.myGamingSessions;
  const groupGamingSessions = state.gamingSessions.groupGamingSessions;
  const moreGamingSessionsAvailable =
    state.gamingSessions.moreGamingSessionsAvailable;
  const moreMyGamingSessionsAvailable =
    state.gamingSessions.moreMyGamingSessionsAvailable;
  const moreGroupGamingSessionsAvailable =
    state.gamingSessions.moreGroupGamingSessionsAvailable;

  const user = state.users.currentUser;
  return {
    activity,
    game,
    gameId,
    platform,
    notFull,
    // gamingSessionsLoading,
    // myGamingSessionsLoading,
    // groupGamingSessionsLoading,
    gamingSessionsRefreshing,
    myGamingSessionsRefreshing,
    groupGamingSessionsRefreshing,
    // refreshing,
    moreDataAvailable,
    data,
    myGamingSessions,
    groupGamingSessions,
    moreGamingSessionsAvailable,
    moreMyGamingSessionsAvailable,
    moreGroupGamingSessionsAvailable,
    user,
    gamingSessionsError: state.gamingSessions.error
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionsList));
