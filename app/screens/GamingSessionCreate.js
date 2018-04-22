import React, { Component } from "react";
import { View } from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { createGamingSession } from "../actions/gamingSessions";
import { changeGame } from "../actions/search";

class GamingSessionCreate extends React.Component {
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
      nextProps.gameCreated &&
      nextProps.gameCreated !== this.props.gameCreated
    ) {
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
  const groups = state.users.user.groups_for_api;
  const user = state.users.user;
  const isCreating = state.gamingSessions.isCreating;

  return {
    gameId,
    game,
    games,
    activities,
    groups,
    user,
    isCreating,
    gameCreated: state.gamingSessions.gameCreated,
    gamingSessionError: state.gamingSessions.error
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
