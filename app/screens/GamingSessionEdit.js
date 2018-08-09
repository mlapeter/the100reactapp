import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { colors, fontSizes, fontStyles } from "../styles";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  deleteGamingSession,
  editGamingSession,
  refreshMyGamingSessions
} from "../actions/gamingSessions";

import { changeGame } from "../actions/search";

class GamingSessionEdit extends React.Component {
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
      nextProps.gamingSessions.gameEdited &&
      nextProps.gamingSessions.successAt !== this.props.gamingSessions.successAt
    ) {
      this.props.dispatch(refreshMyGamingSessions());
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Edited!");
    }
    if (
      nextProps.gamingSessions.gameDeleted &&
      nextProps.gamingSessions.successAt !== this.props.gamingSessions.successAt
    ) {
      this.props.dispatch(refreshMyGamingSessions());
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Deleted.");
    }
  }

  handlePress = formValue => {
    if (formValue) {
      this.props.dispatch(editGamingSession(formValue));
    }
  };

  render() {
    if (this.props.gamingSessions.isLoading) {
      return (
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.outerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.container}>
              <View style={styles.logoutContainer}>
                <Button
                  style={{
                    height: 25,
                    width: 180,
                    marginBottom: 25
                  }}
                  onPress={() =>
                    this.props.dispatch(
                      deleteGamingSession(this.props.gamingSession.id)
                    )}
                  title="Delete"
                />
              </View>
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
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>

      // <View style={{ flex: 1 }}>
      //   <View style={styles.buttonsContainer}>
      //     <Button
      //       style={{
      //         height: 25,
      //         width: 180,
      //         marginBottom: 25
      //       }}
      //       onPress={() =>
      //         this.props.dispatch(
      //           deleteGamingSession(this.props.gamingSession.id)
      //         )}
      //       title="Delete"
      //     />
      //   </View>
      //   <GamingSessionForm
      //     handlePress={this.handlePress}
      //     changeGame={gameId => this.props.dispatch(changeGame(gameId))}
      //     gameId={this.props.gameId}
      //     game={this.props.game}
      //     games={this.props.games}
      //     activities={this.props.activities}
      //     groups={this.props.groups}
      //     isEditing={this.props.isEditing}
      //     gamingSession={this.props.gamingSession}
      //     editGameForm={true}
      //   />
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  },

  scrollContainer: {
    backgroundColor: colors.white
  },

  outerContainer: {
    flex: 1,
    backgroundColor: colors.white
  },

  container: {
    flex: 1,
    marginTop: 30,
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  buttonWrapper: {
    padding: 10
  },
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10
  },
  emailNoteContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  emailNoteText: {
    color: colors.lightGrey
  }
});

const mapStateToProps = state => {
  const gameId = state.search.gameId;
  const game = state.search.game;
  const games = state.search.games;
  const activities = state.search.activities;
  const groups = state.users.currentUser.groups_for_api;
  const isEditing = state.gamingSessions.isEditing;

  const gamingSession = state.gamingSessions.gamingSession;
  const gamingSessions = state.gamingSessions;

  return {
    gameId,
    game,
    games,
    activities,
    groups,
    isEditing,
    // gameCreated: state.gamingSessions.gameCreated,
    // gameEdited: state.gamingSessions.gameEdited,
    // gamingSessionError: state.gamingSessions.error,
    gamingSession,
    gamingSessions
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionEdit));
