import React, { Component } from "react";
import { View } from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  createGamingSession,
  refreshMyGamingSessions
} from "../actions/gamingSessions";
import { changeGame } from "../actions/search";

class GamingSessionCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

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
    console.log("Form Button Clicked");
    console.log(formValue);
    if (formValue) {
      this.props.dispatch(createGamingSession(formValue));
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GamingSessionForm
          handlePress={this.handlePress}
          changeGame={gameId => this.props.dispatch(changeGame(gameId))}
          gameId={this.props.gameId}
          game={this.props.game}
          games={this.props.games}
          activities={this.props.activities}
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
  const game = state.search.game;
  const games = state.search.games;
  const activities = state.search.activities;
  const groups = state.users.cuurentUser.groups_for_api;
  const user = state.users.currentUser;
  const isCreating = state.gamingSessions.isCreating;
  const gamingSessions = state.gamingSessions;

  return {
    gameId,
    game,
    games,
    activities,
    groups,
    user,
    isCreating,
    gamingSessions
    // gameCreated: state.gamingSessions.gameCreated,
    // gamingSessionError: state.gamingSessions.error
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
