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
    if (formValue) {
      this.props.dispatch(createGamingSession(formValue));
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GamingSessionForm
          handlePress={this.handlePress}
          activities={this.props.activities}
          groups={this.props.groups}
          isCreating={this.props.isCreating}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const games = state.search.games;
  const activities = state.search.activities;
  const groups = state.users.user.groups_for_api;
  const isCreating = state.gamingSessions.isCreating;

  return {
    games,
    activities,
    groups,
    isCreating,
    gameCreated: state.gamingSessions.gameCreated,
    gamingSessionError: state.gamingSessions.error
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
