import React, { Component } from "react";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View
} from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  createGamingSession,
  refreshMyGamingSessions
} from "../actions/gamingSessions";
import { changeGame, fetchGames } from "../actions/search";
import { fetchGroup } from "../actions/group";

class GamingSessionCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(fetchGroup());
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Gaming Session Create"))
      .catch(e => console.log(e.message));
    if (!this.props.games) {
      console.log("re-fetching games");
      this.props.dispatch(fetchGames());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessions.error &&
      nextProps.gamingSessions.errorAt !== this.props.gamingSessions.errorAt
    ) {
      this.props.alertWithType(
        "error",
        "Error",
        nextProps.gamingSessions.error
      );
    }
    if (
      nextProps.gamingSessions.gameCreated &&
      nextProps.gamingSessions.successAt !== this.props.gamingSessions.successAt
    ) {
      console.log("nextProps.gamingSessions.gameCreated:")
      console.log(nextProps.gamingSessions)
      this.props.dispatch(refreshMyGamingSessions());
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Created!");
    }
  }

  handlePress = formValue => {
    if (formValue) {
      this.props.dispatch(createGamingSession(formValue));
    }
  };

  render() {
    if (!this.props.user || !this.props.games || !this.props.gameId) {
      return (
        <View style={styles.container}>
          <ActivityIndicator style={styles.loading} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <GamingSessionForm
          handlePress={this.handlePress}
          gameId={this.props.gameId}
          games={this.props.games}
          groups={this.props.groups}
          isCreating={this.props.isCreating}
          user={this.props.user}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  const gameId = state.search.gameId;
  const games = state.search.games;
  const groups = state.users.currentUser.groups_for_api;
  const user = state.users.currentUser;
  const isCreating = state.gamingSessions.isCreating;
  const gamingSessions = state.gamingSessions;

  return {
    gameId,
    games,
    groups,
    user,
    isCreating,
    gamingSessions
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
