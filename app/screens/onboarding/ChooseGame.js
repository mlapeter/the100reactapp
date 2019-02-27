import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../../config/environment";

import { setGame } from "../../actions/onboarding";
import { colors, fontSizes, fontStyles } from "../../styles";
import GamesList from "../../components/GamesList"

class ChooseGame extends Component {

  componentDidMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Onboarding Choose Game"))
      .catch(e => console.log(e.message));
  }

  selectGame = (gameId) => {
    this.props.dispatch(setGame(gameId));
    this.props.navigation.navigate("GamerProfile");
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Which Game?</Text>
        <Text style={styles.contentText}>
          We'll match you into a group that plays it.
        </Text>
        <View>
          <GamesList games={this.props.games} selectGame={this.selectGame} />
        </View>
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: colors.veryDarkGrey,
    paddingTop: 40
  },
  title: {
    fontSize: fontSizes.h1,
    color: colors.white,
    opacity: colors.headlineOpacity,
    // textAlign: "left",
    paddingHorizontal: 20,

  },
  contentText: {
    fontSize: fontSizes.secondary,
    color: colors.white,
    opacity: colors.primaryOpacity,
    padding: 20
  }
};

const mapStateToProps = state => ({
  onboarding: state.onboarding,
  games: state.search.games
});


export default connect(mapStateToProps)(connectAlert(ChooseGame));
