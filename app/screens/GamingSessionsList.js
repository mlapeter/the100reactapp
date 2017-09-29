import React, { Component, PropTypes, PureComponent } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { colors, fontSizes } from "../styles";
import { FontAwesome } from "@expo/vector-icons";
import PreSplash from "../components/PreSplash/PreSplash";
import GamingSessionsItem from "../components/GamingSessionsItem/GamingSessionsItem";
import GamingSessionsFilter from "../components/GamingSessionsFilter/GamingSessionsFilter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Tabs from "../components/Tabs/Tabs";

import { connect } from "react-redux";
import { fetchGames } from "../actions/search";
import { changePage } from "../actions/search";
import { fetchGamingSessions } from "../actions/gamingSessions";
import { refreshGamingSessions } from "../actions/gamingSessions";
import { loadMoreGamingSessions } from "../actions/gamingSessions";

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
    data: PropTypes.array
  };
  constructor(props) {
    super(props);
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
  }

  handleRefresh = () => {
    console.log("handleRefresh Triggered");
    this.props.dispatch(changePage(1));
    this.props.dispatch(refreshGamingSessions(this.searchUrl()));
  };

  handleLoadMore = () => {
    console.log("handleLoadMore Triggered");
    if (
      this.props.refreshing === false &&
      this.props.moreDataAvailable === true
    ) {
      console.log("handleLoadMore Activated");
      this.props.dispatch(changePage(this.props.page + 1));
      this.props.dispatch(loadMoreGamingSessions(this.searchUrl()));
    }
  };

  renderFooter = () => {
    if (!this.props.moreDataAvailable) {
      console.log(
        "In Footer moreDataAvailable: " + this.props.moreDataAvailable
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
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            {/* <Text style={styles.tabText}>Options</Text> */}
            <MaterialCommunityIcons
              name="menu"
              size={24}
              color={colors.mediumGrey}
            />
          </TouchableOpacity>
          <View style={styles.optionsContainerRight}>
            <GamingSessionsFilter
              style={styles.optionContainer}
              updateFilter={this.updateFilter}
            />
            <TouchableOpacity style={styles.optionContainer}>
              {/* <Text style={styles.tabText}>Options</Text> */}
              <MaterialCommunityIcons
                name="plus-box"
                size={24}
                color={colors.mediumGrey}
              />
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
              // keyExtractor={item => item.id}
              keyExtractor={(item, index) => index}
              refreshing={this.props.refreshing}
              onRefresh={this.handleRefresh}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0}
            />
          </View>
          <View title="GROUP GAMES" style={styles.content}>
            <Text style={styles.header}>Group Games</Text>
            <Text style={styles.text}>All group games would go here.</Text>
          </View>
          <View title="MY GAMES" style={styles.content}>
            <Text style={styles.header}>My Games</Text>
            <Text style={styles.text}>My games would go here.</Text>
          </View>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // App container
  container: {
    flex: 1, // Take up all screen
    backgroundColor: colors.white // Background color
  },
  // Tab content container
  content: {
    flex: 1, // Take up all available space
    // justifyContent: "center", // Center vertically
    // alignItems: "center", // Center horizontally
    backgroundColor: colors.white // Darker background for content area
  },
  // Content header
  header: {
    margin: 10, // Add margin
    color: "#FFFFFF", // White color
    fontFamily: "Avenir", // Change font family
    fontSize: 26 // Bigger font size
  },
  // Content text
  text: {
    marginHorizontal: 20, // Add horizontal margin
    // color: "rgba(255, 255, 255, 0.75)", // Semi-transparent text
    color: colors.grey,
    textAlign: "center", // Center
    fontFamily: "Avenir",
    fontSize: 18
  },

  optionsContainer: {
    flexDirection: "row", // Arrange tabs in a row
    justifyContent: "space-between",
    paddingTop: 20 // Top padding
  },
  // Individual tab container
  optionsContainerRight: {
    flexDirection: "row"
  },
  optionContainer: {
    // flex: 1, // Take up equal amount of space for each tab
    padding: 20 // Vertical padding
    // borderBottomWidth: 3, // Add thick border at the bottom
    // borderBottomColor: "transparent" // Transparent border for inactive tabs
  }
});

// const styles = StyleSheet.create({
//   defaultText: {
//     color: colors.white
//   },
//   container: {
//     marginTop: 20,
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "stretch",
//     backgroundColor: colors.white
//   },
//   alertView: {
//     flexDirection: "row",
//     justifyContent: "center"
//   },
//   loading: {
//     alignItems: "center",
//     justifyContent: "center",
//     margin: 10
//   }
// });

const mapStateToProps = state => {
  const activity = state.search.activity;
  const gameId = state.search.gameId;
  const game = state.search.games[gameId] || {};
  const notFull = state.search.notFull;
  const page = state.search.page;
  const platform = state.search.platform;
  const isLoading = state.gamingSessions.isLoading;
  const refreshing = state.gamingSessions.refreshing;
  const moreDataAvailable = state.gamingSessions.moreDataAvailable;
  const data = state.gamingSessions.gamingSessions;

  return {
    activity,
    game,
    gameId,
    page,
    platform,
    notFull,
    isLoading,
    refreshing,
    moreDataAvailable,
    data
  };
};

export default connect(mapStateToProps)(GamingSessionsList);
