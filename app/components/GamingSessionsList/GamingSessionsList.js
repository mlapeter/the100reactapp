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
              source={{
                uri: this.props.data.game_avatar_url
              }}
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
              />
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
      loading: true,
      data: [],
      gamesData: [],
      page: 1,
      gameType: 1,
      platform: "xbox-one",
      activity: "",
      URL: "",
      notFull: false,
      error: null,
      refreshing: false
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
        refreshing: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  onLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
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
        notFull: notFull
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
    this.buildURL();
    this.fetchGamesList();
    // this.fetchData();
  }

  fetchGamesList = () => {
    //http://pwn-staging.herokuapp.com/api/v1/games
    let url = "https://www.the100.io/api/v1/games";
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
      })
      .catch(error => {
        console.log("error", error);
        this.setState({ error });
      });
  };

  fetchData = () => {
    const page = this.state.page;
    var url = this.state.URL + "&page=" + page;
    this.setState({ loading: true });

    console.log("FETCHING DATA", url);

    fetch(url)
      .then(response => response.json())
      .then(response => {
        this.setState({
          data: page === 1 ? response : [...this.state.data, ...response],
          error: response.error || null,
          loading: false,
          refreshing: false
        });
        console.log("this.state.data len after", this.state.data.length);
      })
      .catch(error => {
        console.log("error", error);
        this.setState({ error, loading: false });
      });
  };

  renderHeader = () => {
    if (!this.state.refreshing) return null;

    return (
      <View
        style={{
          paddingVertical: 5,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 25,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <View>
        <FilterModal
          onFilterUpdate={this.updateFilters}
          onFilterClose={this.buildURL}
          gamesData={this.state.gamesData}
          gameType={this.state.gameType}
          activity={this.state.activity}
          platform={this.state.platform}
          notFull={this.state.notFull}
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <MyListItem data={item} onPressItem={this.goToSession} />
          )}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => item.id}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={3}
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
    flex: 1.1
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
