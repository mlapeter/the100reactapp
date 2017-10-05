import React, { Component, PropTypes, PureComponent } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

import Tabs from "../components/Tabs/Tabs";

import { connect } from "react-redux";
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
    refreshing: PropTypes.bool,
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
      "https://pwntastic.herokuapp.com/api/v2/gaming_sessions" +
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
    this.props.dispatch(refreshGamingSessions(this.searchUrl()));
  };

  refreshMyGames = () => {
    console.log("refreshMyGames Triggered");
    this.props.dispatch(refreshMyGamingSessions());
  };

  refreshGroupGames = () => {
    console.log("refreshGroupGames Triggered");
    this.props.dispatch(refreshGroupGamingSessions());
  };

  loadMoreGamingSessions = () => {
    if (
      this.props.refreshing === false &&
      this.props.moreGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreGamingSessions Activated");
      this.props.dispatch(loadMoreGamingSessions(this.searchUrl()));
    }
  };

  loadMoreGroupGamingSessions = () => {
    if (
      this.props.refreshing === false &&
      this.props.moreGroupGamingSessionsAvailable === true
    ) {
      console.log("LoadMoreGroupGamingSessions Activated");
      this.props.dispatch(loadMoreGroupGamingSessions());
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
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => this.props.navigation.navigate("DrawerOpen")}
          >
            <Image
              style={styles.avatarMini}
              source={
                this.props.user.computed_avatar_api === "img/default-avatar.png"
                  ? require("../../app/images/default-avatar.png")
                  : { uri: this.props.user.computed_avatar_api }
              }
            />
          </TouchableOpacity>
          <View style={styles.search}>
            <View style={styles.input}>
              <Ionicons
                name="md-search"
                size={24}
                color={colors.lightGrey}
                style={{ marginRight: 5 }}
              />
              <TextInput
                placeholder="Coming Soon"
                style={{ color: colors.white }}
              />
            </View>
          </View>
          <View style={styles.optionsContainerRight}>
            <GamingSessionsFilter updateFilter={this.updateFilter} />
            <TouchableOpacity style={styles.optionContainer}>
              {/* <Text style={styles.tabText}>Options</Text> */}
              <Ionicons name="md-add" size={32} color={colors.mediumGrey} />
            </TouchableOpacity>
          </View>
        </View>
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
              refreshing={this.props.refreshing}
              onRefresh={this.refreshGames}
              onEndReached={this.loadMoreGamingSessions}
              onEndReachedThreshold={5}
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
              // ListEmptyComponent={this.renderEmpty}
              extraData={this.props}
              // Getting errors using game id
              // keyExtractor={item => item.id}
              keyExtractor={(item, index) => index}
              refreshing={this.props.refreshing}
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
              refreshing={this.props.refreshing}
              onRefresh={this.refreshMyGames}
              onEndReached={this.loadMoreMyGamingSessions}
              onEndReachedThreshold={0}
            />
          </View>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    backgroundColor: colors.white
  },
  // Tab content container
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: colors.white
  },
  // Content header
  header: {
    margin: 10,
    color: "#FFFFFF",
    fontFamily: "Avenir",
    fontSize: 26
  },
  // Content text
  text: {
    marginHorizontal: 20,
    // color: "rgba(255, 255, 255, 0.75)", // Semi-transparent text
    color: colors.grey,
    textAlign: "center",
    fontFamily: "Avenir",
    fontSize: 18
  },

  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
    // paddingTop: 10
  },
  optionsContainerRight: {
    marginTop: 3,
    padding: 3,
    flexDirection: "row"
  },
  optionContainer: {
    // flex: 1,
    paddingHorizontal: 20
    // paddingTop: 5
    // paddingBottom: 10
    // borderBottomWidth: 3, // Add thick border at the bottom
    // borderBottomColor: "transparent" // Transparent border for inactive tabs
  },
  avatarMini: {
    height: 36,
    width: 36,
    marginTop: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  alertView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  search: {
    flexDirection: "row",
    flex: 10,
    // paddingTop: 5,
    // marginLeft: 25,
    // marginRight: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    // borderRadius: 3,
    // borderBottomColor: colors.lightGrey,
    backgroundColor: colors.white
  },
  input: {
    flexDirection: "row",
    flex: 1,
    padding: 5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: colors.searchbar
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
  const refreshing = state.gamingSessions.refreshing;
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
    refreshing,
    moreDataAvailable,
    data,
    myGamingSessions,
    groupGamingSessions,
    moreGamingSessionsAvailable,
    moreMyGamingSessionsAvailable,
    moreGroupGamingSessionsAvailable,
    user
  };
};

export default connect(mapStateToProps)(GamingSessionsList);
