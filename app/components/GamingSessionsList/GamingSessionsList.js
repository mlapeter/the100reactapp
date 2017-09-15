import React, { Component, PropTypes, PureComponent } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";
import { StackNavigator } from "react-navigation";
import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes } from "../../styles";
import GamingSession from "./GamingSession";
import FilterModal from "../../components/GamingSessionsList/FilterModal";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class GamingSessionsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      data: [],
      moreDataAvailable: true,
      gamesData: null,
      page: 1,
      gameId: 23,
      activity: "",
      platform: "ps4",
      notFull: 1,
      error: null,
      modalVisible: false
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {
    this.fetchGamesData();
    this.updateFilter(
      this.state.platform,
      this.state.gameId,
      this.state.activity
    );
  }

  fetchGamesData() {
    return fetch("https://www.the100.io/api/v1/games")
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          gamesData: responseJson
        });
      })
      .catch(error => {
        console.log("Error Fetching Games Data");
      });
  }

  updateFilter(platform, gameId, activity) {
    this.setState(
      {
        gameId: gameId,
        activity: activity,
        platform: platform,
        data: [],
        moreDataAvailable: true,
        page: 1
      },
      () => {
        this.fetchData();
      }
    );
  }

  searchUrl() {
    return encodeURI(
      "https://the100.io/api/v2/gaming_sessions?page=" +
        this.state.page +
        "&q[game_id_eq]=" +
        this.state.gameId +
        "&q[platform_cont]=" +
        this.state.platform +
        "&q[category_cont]=" +
        this.state.activity +
        "&q[with_available_slots]=" +
        this.state.notFull
    );
  }

  fetchData() {
    console.log(this.searchUrl());
    return fetch(this.searchUrl())
      .then(response => response.json())
      .then(responseJson => {
        console.log("Games Fetched");
        if (responseJson.length === 0) {
          console.log("No More Data");
          this.setState({
            isLoading: false,
            refreshing: false,
            moreDataAvailable: false
          });
        } else {
          console.log("Games Found");
          this.setState({
            isLoading: false,
            refreshing: false,
            data:
              this.state.page === 1
                ? responseJson
                : [...this.state.data, ...responseJson],
            error: responseJson.error || null
          });
        }
      })
      .catch(error => {
        this.setState({ error, isloading: false, refreshing: false });
        console.log("Error Fetching Gaming Sessions");
      });
  }

  handleRefresh = () => {
    console.log("handleRefresh Triggered");
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

  handleLoadMore = () => {
    console.log("handleLoadMore Triggered");
    if (this.state.moreDataAvailable === true) {
      this.setState(
        {
          page: this.state.page + 1,
          refreshing: true
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderFooter = () => {
    if (!this.state.moreDataAvailable) {
      console.log(
        "In Footer moreDataAvailable: " + this.state.moreDataAvailable
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

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FilterModal
          updateFilter={this.updateFilter}
          gameId={this.state.gameId}
          activity={this.state.activity}
          platform={this.state.platform}
          notFull={this.state.notFull}
          gamesData={this.state.gamesData}
        />

        <FlatList
          data={this.state.data}
          renderItem={({ item }) =>
            <GamingSession data={item} navigation={this.props.navigation} />}
          ListHeaderComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          // Getting errors using game id
          // keyExtractor={item => item.id}
          keyExtractor={(item, index) => index}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
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
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  alertView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
});
