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
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import GamingSessionForm from "../components/GamingSessionForm/GamingSessionForm";
import { colors, fontSizes, fontStyles } from "../styles";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  deleteGamingSession,
  editGamingSession,
  refreshMyGamingSessions
} from "../actions/gamingSessions";
import { changeGame, fetchGames } from "../actions/search";

class GamingSessionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Gaming Session Edit"))
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
      this.props.navigation.navigate("GamingSessionsList");
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
      console.log("Gaming Session Form Submitted");
      console.log(formValue);
      this.props.dispatch(editGamingSession(formValue));
    }
  };

  render() {
    if (
      !this.props.user ||
      !this.props.games ||
      !this.props.gameId ||
      !this.props.gamingSession ||
      !this.props.gamingSession.game_id ||
      this.props.gamingSessions.isLoading
    ) {
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
                    )
                  }
                  title={
                    this.props.navigation.state.params &&
                      this.props.navigation.state.params.confirmDelete
                      ? "Confirm Delete"
                      : "Delete"
                  }
                />
              </View>
              <GamingSessionForm
                handlePress={this.handlePress}
                // changeGame={gameId => this.props.dispatch(changeGame(gameId))}
                gameId={this.props.gamingSession.game_id}
                // game={this.props.game}
                games={this.props.games}
                // activities={this.props.activities}
                groups={this.props.groups}
                isEditing={this.props.isEditing}
                gamingSession={this.props.gamingSession}
                editGameForm={true}
                user={this.props.user}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
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
    // backgroundColor: colors.white
  },

  outerContainer: {
    flex: 1
    // backgroundColor: colors.white
  },

  container: {
    flex: 1,
    // marginTop: 30,
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
    // backgroundColor: colors.white
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
  const gameId = state.gamingSessions.gamingSession.game_id;
  const games = state.search.games;
  const groups = state.users.currentUser.groups_for_api;
  const isEditing = state.gamingSessions.isEditing;

  const gamingSession = state.gamingSessions.gamingSession;
  const gamingSessions = state.gamingSessions;

  const user = state.users.currentUser;

  return {
    gameId,
    games,
    groups,
    isEditing,
    gamingSession,
    gamingSessions,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionEdit));
