import React, { Component } from "react";
import { View } from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { editGamingSession } from "../actions/gamingSessions";
import { changeGame } from "../actions/search";

class GamingSessionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessionError &&
      nextProps.gamingSessionError !== this.props.gamingSessionError
    ) {
      this.props.alertWithType("error", "Error", nextProps.gamingSessionError);
    }
    if (
      nextProps.gameEdited &&
      nextProps.gameEdited !== this.props.gameEdited
    ) {
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Edited!");
    }
    if (
      nextProps.gameEdited &&
      nextProps.gameEdited !== this.props.gameEdited
    ) {
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Updated!");
    }
  }

  handlePress = formValue => {
    if (formValue) {
      this.props.dispatch(editGamingSession(formValue));
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
          isEditing={this.props.isEditing}
          gamingSession={this.props.gamingSession}
          editGameForm={true}
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
  const groups = state.users.user.groups_for_api;
  const isEditing = state.gamingSessions.isEditing;

  const gamingSession = state.gamingSessions.gamingSession;

  return {
    gameId,
    game,
    games,
    activities,
    groups,
    isEditing,
    gameCreated: state.gamingSessions.gameCreated,
    gameEdited: state.gamingSessions.gameEdited,
    gamingSessionError: state.gamingSessions.error,
    gamingSession
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionEdit));
