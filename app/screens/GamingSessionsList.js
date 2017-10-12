import React, { Component, PropTypes, PureComponent } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { colors, fontSizes } from "../styles";
import PreSplash from "../components/PreSplash/PreSplash";
import GamingSessionsItem from "../components/GamingSessionsItem/GamingSessionsItem";
import GamingSessionsFilter from "../components/GamingSessionsFilter/GamingSessionsFilter";
import MyGamingSessionsList from "../components/MyGamingSessionsList/MyGamingSessionsList";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { Icon } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import Tabs from "../components/Tabs/Tabs";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

import { fetchGames } from "../actions/search";
import { changeGamingSessionsPage } from "../actions/search";

import { fetchGamingSessions } from "../actions/gamingSessions";
import { refreshGamingSessions } from "../actions/gamingSessions";

import { loadMoreGamingSessions } from "../actions/gamingSessions";
import { fetchMyGamingSessions } from "../actions/gamingSessions";
import { refreshMyGamingSessions } from "../actions/gamingSessions";
import { loadMoreMyGamingSessions } from "../actions/gamingSessions";

import { fetchGroupGamingSessions } from "../actions/gamingSessions";
import { refreshGroupGamingSessions } from "../actions/gamingSessions";
import { loadMoreGroupGamingSessions } from "../actions/gamingSessions";

class GamingSessionsList extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.string,
    game: PropTypes.object,
    gameId: PropTypes.string,
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

  componentDidMount() {
    this.fetchGamesData();
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessionsError &&
      nextProps.gamingSessionsError !== this.props.gamingSessionsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.gamingSessionsError);
    }
  }

  fetchGamesData() {
    this.props.dispatch(fetchGames());
  }

  updateFilter() {
    console.log(this.searchUrl());
    this.props.dispatch(fetchGamingSessions(this.searchUrl()));

    // this.setState(
    //   {
    //     data: [],
    //     moreDataAvailable: true
    //   },
    //   () => {
    //     this.fetchData(this.searchUrl());
    //   }
    // );
  }

  searchUrl() {
    return encodeURI(
      "https://pwn-staging.herokuapp.com/api/v2/gaming_sessions" +
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

  fetchData() {
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
      this.props.gamingSessionsRefreshing === false &&
      this.props.moreMyGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreMyGamingSessions Activated");
      this.props.dispatch(loadMoreMyGamingSessions(this.searchUrl()));
    }
  };

  renderFooter = () => {
    if (!this.props.moreGamingSessionsAvailable) {
      console.log(
        "In Footer moreGamingSessionsAvailable: " +
          this.props.moreGamingSessionsAvailable
      );
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
    if (this.props.gamingSessionsLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Image
                style={styles.avatarMini}
                source={
                  this.props.user.computed_avatar_api ===
                  "img/default-avatar.png"
                    ? require("../../app/images/default-avatar.png")
                    : { uri: this.props.user.computed_avatar_api }
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.search}>
            <View style={styles.input}>
              <GamingSessionsFilter updateFilter={this.updateFilter} />
              <TextInput
                placeholder="Search Coming Soon"
                style={{
                  flexDirection: "row",
                  flex: 5,
                  color: colors.white,
                  marginLeft: 5
                }}
              />
            </View>
          </View>

          <View style={styles.add}>
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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Tabs>
            <View title="PUBLIC GAMES" style={styles.content}>
              <FlatList
                data={this.props.data}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
                // ListEmptyComponent={this.renderEmpty}
                extraData={this.props}
                // Getting errors using game id
                keyExtractor={item => item.id}
                keyExtractor={(item, index) => index}
                refreshing={this.props.gamingSessionsRefreshing}
                onRefresh={this.refreshGames}
                onEndReached={this.loadMoreGamingSessions}
                onEndReachedThreshold={0.8}
              />
            </View>
            <View title="GROUP GAMES" style={styles.content}>
              <FlatList
                data={this.props.groupGamingSessions}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
                ListHeaderComponent={this.renderEmpty}
                ListFooterComponent={this.renderGroupFooter}
                ListEmptyComponent={this.renderEmpty}
                extraData={this.props}
                // Getting errors using game id
                // keyExtractor={item => item.id}
                keyExtractor={(item, index) => index}
                refreshing={this.props.groupGamingSessionsRefreshing}
                onRefresh={this.refreshGroupGames}
                onEndReached={this.loadMoreGroupGamingSessions}
                onEndReachedThreshold={0}
              />
            </View>
            <View title="MY GAMES" style={styles.content}>
              <FlatList
                data={this.props.myGamingSessions}
                renderItem={({ item }) => (
                  <GamingSessionsItem
                    data={item}
                    navigation={this.props.navigation}
                  />
                )}
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
    paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  // Tab content container
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },

  menu: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "flex-start"
  },
  search: {
    flexDirection: "row",
    flex: 10,
    marginLeft: 25,
    marginRight: 10,
    padding: 5,
    alignItems: "center",
    paddingHorizontal: 5,
    // borderRadius: 3,
    // borderBottomColor: colors.lightGrey,
    backgroundColor: colors.white
  },
  input: {
    flexDirection: "row",
    flex: 10,
    padding: 5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: colors.searchbar
  },
  add: {
    flex: 1,
    marginRight: 10,
    alignItems: "center"
  },

  optionContainer: {
    // flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
    // borderBottomWidth: 3, // Add thick border at the bottom
    // borderBottomColor: "transparent" // Transparent border for inactive tabs
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
    // justifyContent: "center",
    // alignItems: "center",
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
  const platform = state.search.platform;

  const gamingSessionsLoading = state.gamingSessions.gamingSessionsLoading;
  const myGamingSessionsLoading = state.gamingSessions.myGamingSessionsLoading;
  const groupGamingSessionsLoading =
    state.gamingSessions.groupGamingSessionsLoading;
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

  const user = state.authentication.user;

  return {
    activity,
    game,
    gameId,
    platform,
    notFull,
    gamingSessionsLoading,
    myGamingSessionsLoading,
    groupGamingSessionsLoading,
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
