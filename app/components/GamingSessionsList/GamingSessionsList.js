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
import GameSessions from "../../components/GamingSessionsList/gamesessions.json";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class MyListItem extends React.PureComponent {
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
      loading: false, //load more
      fetching: true, // any fetch
      refreshing: true, // full refresh or load
      data: [],
      gamesData: [],
      page: 1,
      gameType: 1,
      platform: "xbox-one",
      activity: "",
      URL: "",
      notFull: false,
      error: null
    };
    this.updateFilters = this.updateFilters.bind(this);
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
        refreshing: true,
        fetching: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  onLoadMore = () => {
    if (this.state.page >= 10) {
      return null;
    }

    this.setState(
      {
        page: this.state.page + 1,
        loading: true,
        fetching: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  updateFilters(gameType, platform, activity, notFull) {
    console.info("updateFilters");
    this.setState(
      {
        gameType: gameType,
        platform: platform,
        activity: activity,
        notFull: notFull,
        refreshing: true,
        fetching: true
      },
      () => {
        this.buildURL();
      }
    );
  }

  buildURL = () => {
    var _URL = "https://www.the100.io/api/v1/gaming_sessions?";

    if (this.state.gameType != null) {
      _URL += "q[game_id_eq]=" + this.state.gameType;
    }

    if (this.state.platform != null) {
      _URL += "&q[platform_cont]=" + this.state.platform;
    }

    if (this.state.activity != "" && this.state.activity != "Any") {
      _URL += "&q[category_cont]=" + this.state.activity;
    }

    if (this.state.notFull != null) {
      _URL += "&q[with_available_slots]=" + this.state.notFull;
    }

    this.setState(
      {
        URL: _URL,
        page: 1
      },
      () => {
        this.fetchData();
      }
    );
  };

  componentDidMount() {
    this.setState({
      refreshing: true,
      fetching: true
    });
    this.buildURL();
    this.fetchGamesList();
    // this.fetchData();
  }

  fetchGamesList = () => {
    let url = "http://pwn-staging.herokuapp.com/api/v1/games";
    //let url = "https://www.the100.io/api/v1/games";
    //  let = require("../../components/GamingSessionsList/gameslist.json");
    //this.setState({ loading: true });

    console.log("FETCHING GAMES DATA", url);

    fetch(url)
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

  fetchData = () => {
    const page = this.state.page;
    var url = this.state.URL + "&page=" + page;
    //this.setState({ refreshing: true });

    console.log("FETCHING DATA", url);

    fetch(url)
      .then(response => response.json())
      .then(response => {
        this.setState({
          data: page === 1 ? response : [...this.state.data, ...response],
          error: response.error || null,
          loading: false,
          refreshing: false,
          fetching: false
        });
        if (this.state.data.length == undefined) {
          this.setState({
            data: GameSessions,
            error: response.error || null
          });
        }
        console.log("this.state.data len after", this.state.data.length);
      })
      .catch(error => {
        console.log("error", error);
        this.setState({
          error,
          loading: false,
          refreshing: false,
          fetching: false
        });
      });
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          //paddingVertical: 25,
          //borderTopWidth: 1,
          //borderColor: "#CED0CE",
          backgroundColor: colors.red
        }}
      >
        <Text>Footer</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        {this.state.refreshing == false && (
          <FilterModal
            onFilterUpdate={this.updateFilters}
            onFilterClose={this.buildURL}
            gamesData={this.state.gamesData}
            gameType={this.state.gameType}
            activity={this.state.activity}
            platform={this.state.platform}
            notFull={this.state.notFull}
          />
        )}

        {this.state.refreshing == true && (
          <View
            style={{
              paddingVertical: 200
            }}
          >
            <PreSplash />
          </View>
        )}

        {this.state.refreshing == false &&
          (this.state.data.length > 0 && (
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <MyListItem data={item} onPressItem={this.goToSession} />
              )}
              // ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              keyExtractor={(item, index) => item.id}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.onLoadMore}
              onEndReachedThreshold={0.5}
            />
          ))}

        {this.state.fetching == false &&
          (this.state.data.length <= 0 && (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={colors.mediumGrey}
              />
              <Text style={styles.alertText}>
                There are no games of this type.
              </Text>
            </View>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
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
