import React, { Component } from "react";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import {
  ActivityIndicator,
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
      this.props.navigation.navigate("GamingSessionsList");
      this.props.dispatch(refreshMyGamingSessions());
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
          groupsNew={this.props.groupsNew}
          isCreating={this.props.isCreating}
          user={this.props.user}
          platform={this.props.user.platform}
          gamingSessionVisibility={this.props.gamingSessionVisibility}
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
  const groupsNew = state.users.currentUser.groups_for_api_new;
  const user = state.users.currentUser;
  const isCreating = state.gamingSessions.isCreating;
  const gamingSessions = state.gamingSessions;
  const gamingSessionVisibility = state.gamingSessions.gamingSessionVisibility

  return {
    gameId,
    games,
    groups,
    groupsNew,
    user,
    isCreating,
    gamingSessions,
    gamingSessionVisibility
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
