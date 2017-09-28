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
import PreSplash from "../components/PreSplash/PreSplash";
import { colors, fontSizes } from "../styles";
import GamingSessionsItem from "../components/GamingSessionsItem/GamingSessionsItem";
import GamingSessionsFilter from "../components/GamingSessionsFilter/GamingSessionsFilter";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { fetchGames } from "../actions/search";
import { changePage } from "../actions/search";
import { fetchGamingSessions } from "../actions/gamingSessions";

class GamingSessionsList extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.string,
    game: PropTypes.object,
    gameId: PropTypes.string,
    notFull: PropTypes.number,
    page: PropTypes.number,
    platform: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      data: [],
      moreDataAvailable: true,
      gamesData: null,
      error: null
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {
    // this.fetchGamesData();
    this.fetchData();
  }

  // fetchGamesData() {
  //   return fetch("https://pwn-staging.herokuapp.com/api/v2/games")
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log("responeJson is: ");
  //       console.log(responseJson);
  //       // this.setState({
  //       //   gamesData: responseJson
  //       // });
  //       this.props.dispatch(fetchGames(responseJson));
  //     })
  //     .catch(error => {
  //       console.log("Error Fetching Games Data");
  //     });
  // }

  updateFilter() {
    this.props.dispatch(changePage(1));
    this.setState(
      {
        data: [],
        moreDataAvailable: true
      },
      () => {
        this.fetchData();
      }
    );
  }

  searchUrl() {
    return encodeURI(
      "https://the100.io/api/v2/gaming_sessions?page=" +
        this.props.page +
        "&q[game_id_eq]=" +
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

    console.log(this.searchUrl());
    // return fetch(this.searchUrl())
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     console.log("Gaming Sessions Fetched");
    //     if (responseJson.length === 0) {
    //       console.log("No More Data");
    //       this.setState({
    //         isLoading: false,
    //         refreshing: false,
    //         moreDataAvailable: false
    //       });
    //     } else {
    //       console.log("Gaming Sessions Found");
    //       this.setState({
    //         isLoading: false,
    //         refreshing: false,
    //         data:
    //           this.props.page === 1
    //             ? responseJson
    //             : [...this.state.data, ...responseJson],
    //         error: responseJson.error || null
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({ error, isloading: false, refreshing: false });
    //     console.log("Error Fetching Gaming Sessions");
    //   });
  }

  handleRefresh = () => {
    console.log("handleRefresh Triggered");
    this.fetchData();

    // this.props.dispatch(changePage(1));
    // this.setState(
    //   {
    //     refreshing: true
    //   },
    //   () => {
    //     this.fetchData();
    //   }
    // );
  };

  handleLoadMore = () => {
    console.log("handleLoadMore Triggered");
    if (this.state.moreDataAvailable === true) {
      this.props.dispatch(changePage(this.props.page + 1));
      this.setState(
        {
          refreshing: true
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

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

  renderEmpty = () => {
    return (
      <View>
        <Text> No Results</Text>
      </View>
    );
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <GamingSessionsFilter updateFilter={this.updateFilter} />

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
          ListEmptyComponent={this.renderEmpty}
          extraData={this.props}
          // Getting errors using game id
          // keyExtractor={item => item.id}
          keyExtractor={(item, index) => index}
          refreshing={this.props.isLoading}
          onRefresh={this.handleRefresh}
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

const mapStateToProps = state => {
  const activity = state.search.activity;
  const gameId = state.search.gameId;
  const game = state.search.games[gameId] || {};
  const notFull = state.search.notFull;
  const page = state.search.page;
  const platform = state.search.platform;
  const isLoading = state.gamingSessions.isLoading;
  const data = state.gamingSessions.gamingSessions;

  return {
    activity,
    game,
    gameId,
    page,
    platform,
    notFull,
    isLoading,
    data
  };
};

export default connect(mapStateToProps)(GamingSessionsList);
