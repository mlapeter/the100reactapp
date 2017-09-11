import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ListView,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  Picker,
  Modal
} from "react-native";
import { StackNavigator } from "react-navigation";
import FilterModal from "../../components/GamingSessionsList/GamingSessionListFilter";

import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GamesList from "../../components/GamingSessionsList/gameslist.json";
import GamingSessions from "../../components/GamingSessionsList/gamesessions.json";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class GamingSessionsListItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPressItem(this.props.data.id);
  };

  render() {
    return (
      <TouchableHighlight onPress={this.onPress} underlayColor="white">
        <View style={styles.box}>
          <View style={styles.leftBox}>
            <Image
              style={styles.avatarMini}
              source={
                this.props.data.game_avatar_url === "img/default-avatar.png" ? (
                  require("../../images/default-avatar.png")
                ) : (
                  { uri: this.props.data.game_avatar_url }
                )
              }
            />
          </View>
          <View style={styles.middleBox}>
            <Text style={styles.gamingSessionTitle}>
              {this.props.data.category}
            </Text>
            <Text style={styles.gamingSessionDescription} numberOfLines={2}>
              {this.props.data.name}
            </Text>
          </View>
          <View style={styles.rightBox}>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="calendar"
                size={12}
                color={colors.mediumGrey}
              />{" "}
              <Moment element={Text}>{this.props.data.start_time}</Moment>
            </Text>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="account"
                size={14}
                color={colors.mediumGrey}
              />{" "}
              {this.props.data.primary_users_count}/{this.props.data.team_size}
            </Text>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="gauge"
                size={14}
                color={colors.mediumGrey}
              />
              {this.props.data.light_level === null ? (
                " any"
              ) : (
                this.props.data.light_level
              )}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class GamingSessionsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, //full load
      refreshing: true, // full refresh
      isGamingSessionsResponseEmpty: false,
      gamingSessionsData: [],
      gamesData: [],
      page: 1,
      gameType: 23,
      platform: "xbox-one",
      activity: "",
      URL: "",
      notFull: false,
      error: null
    };
  }

  goToSession = id => {
    this.props.navigation.navigate("GamingSession", {
      gamingSessionId: id
    });
  };

  onRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.fetchGamingSessionsData();
      }
    );
  };

  onLoadMore = () => {
    if (this.state.isGamingSessionsResponseEmpty) {
      console.info("Won't load more! Last data was empty.");
      return null;
    }

    // sanity check just in case the load more goes wild in a loop
    if (this.state.page >= 30) {
      console.info("Won't load more! Page is >= 30.");
      return null;
    }

    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.fetchGamingSessionsData();
      }
    );
  };

  updateFilters = (gameType, platform, activity, notFull) => {
    console.info("updateFilters");
    this.setState(
      {
        gameType: gameType,
        platform: platform,
        activity: activity,
        notFull: notFull,
        loading: true,
        page: 1
      },
      () => {
        this.fetchGamingSessionsData();
      }
    );
  };

  componentDidMount() {
    this.fetchGamesData();
    this.fetchGamingSessionsData();
  }

  fetchGamesData = () => {
    //let gamesAPIURL = "http://pwn-staging.herokuapp.com/api/v1/games";
    let gamesAPIURL = "https://www.the100.io/api/v1/games";

    console.log("FETCHING GAMES DATA", gamesAPIURL);

    fetch(gamesAPIURL)

      .then(response => response.json())
      .then(response => {
        this.setState({
          gamesData: response,
          error: response.error || null
        });
        console.log(
          "this.state.gamesData len after",
          this.state.gamesData.length
        );

        if (this.state.gamesData.length == undefined) {
          this.setState({
            gamesData: GamesList,
            error: response.error || null
          });
          console.info("local gameslist", GamesList[0]);
        }
      })
      .catch(error => {
        console.log("error", error);
        this.setState({ error });
      });
  };

  buildGamingSessionsAPIURL = () => {
    let gamingSessionsAPIURL = "https://www.the100.io/api/v1/gaming_sessions?";

    if (this.state.gameType != null) {
      gamingSessionsAPIURL += "q[game_id_eq]=" + this.state.gameType;
    }

    if (this.state.platform != null) {
      gamingSessionsAPIURL += "&q[platform_cont]=" + this.state.platform;
    }

    if (this.state.activity != "" && this.state.activity != "Any") {
      gamingSessionsAPIURL += "&q[category_cont]=" + this.state.activity;
    }

    if (this.state.notFull != null) {
      gamingSessionsAPIURL += "&q[with_available_slots]=" + this.state.notFull;
    }
    return gamingSessionsAPIURL + "&page=" + this.state.page;
  };

  fetchGamingSessionsData = () => {
    let gamingSessionsAPIURL = this.buildGamingSessionsAPIURL();

    console.log("FETCHING DATA", gamingSessionsAPIURL);

    fetch(gamingSessionsAPIURL)
      .then(response => response.json())
      .then(response => {
        this.setState({
          isGamingSessionsResponseEmpty: response.length === 0 ? true : false,
          gamingSessionsData:
            this.state.page === 1
              ? response
              : [...this.state.gamingSessionsData, ...response],
          error: response.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        console.log("error", error);
        this.setState({
          error,
          loading: false,
          refreshing: false
        });
      });
  };

  /// This is displayed under the gaming sessions list
  // if there is more data to fetch then show the activity indicator
  // if there is no more data to fetch then show simple dots
  renderFooter = () => {
    if (this.state.isGamingSessionsResponseEmpty === true) {
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    }

    return (
      <ActivityIndicator
        animating={true}
        size="large"
        style={styles.loadMoreActivityIndicator}
      />
    );
  };

  /// display if there is no data in the gaming sessions array
  renderEmpty = () => {
    if (this.state.gamingSessionsData.length !== 0) return null;

    return (
      <View style={styles.alertView}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={24}
          color={colors.mediumGrey}
        />
        <Text style={styles.alertText}>There are no puppies of this type.</Text>
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={{ marginTop: 10 }}>
        <FilterModal
          loading={this.state.loading}
          onFilterUpdate={this.updateFilters}
          onFilterClose={this.buildURL}
          gamesData={this.state.gamesData}
          gameType={this.state.gameType}
          activity={this.state.activity}
          platform={this.state.platform}
          notFull={this.state.notFull}
        />
        <FlatList
          data={this.state.gamingSessionsData}
          renderItem={({ item }) => (
            <GamingSessionsListItem
              data={item}
              onPressItem={this.goToSession}
            />
          )}
          ListHeaderComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => item.id}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  loadMoreActivityIndicator: {
    flex: 1,
    height: 40
  },
  alertView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  alertText: {
    fontSize: fontSizes.large,
    fontWeight: "bold",
    paddingTop: 5
  },
  container: {
    marginTop: 2,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 1,
    padding: 5,
    borderBottomWidth: 0.1,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 6,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  rightBox: {
    flex: 1.7,
    padding: 2,
    margin: 2
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  gamingSessionTitle: {
    color: colors.grey
    //fontFamily: "Futura"
  },
  gamingSessionDescription: {
    color: colors.lightGrey
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});
