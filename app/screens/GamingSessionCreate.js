import React, { Component } from "react";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import { ActivityIndicator, AsyncStorage, View } from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  createGamingSession,
  refreshMyGamingSessions
} from "../actions/gamingSessions";
import { changeGame } from "../actions/search";
import { fetchGroup } from "../actions/group";

class GamingSessionCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(fetchGroup());
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics.hit(new PageHit("App - Gaming Session Create"));
  }

  componentWillReceiveProps(nextProps) {
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
    if (!this.props.user) {
      return (
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
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
