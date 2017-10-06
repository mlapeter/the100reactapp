import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  ListView,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { createGamingSession } from "../actions/gamingSessions";
import { changeGame } from "../actions/search";

// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class GamingSessionCreate extends React.Component {
  static navigationOptions = () => {
    // headerTitle: "Game";
    // Not Working
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  createGamingSession() {
    this.props.dispatch(createGamingSession());
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text>New Game</Text>
        <Picker style={styles.pickerStyle} selectedValue={this.props.activity}>
          <Picker.Item label="All" value="" />
          {this.props.activities.map(activity => (
            <Picker.Item
              key={activity.toString()}
              label={activity.toString()}
              value={activity.toString()}
            />
          ))}
        </Picker>
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.props.gameId.toString()}
          onValueChange={gameId => {
            this.props.dispatch(changeGame(gameId));
          }}
        >
          <Picker.Item label="Destiny" value="1" />
          <Picker.Item label="Destiny 2" value="23" />
        </Picker>
        <View style={styles.modalButtonStyle}>
          <Button onPress={() => {}} title="Search" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
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
  }
});

const mapStateToProps = state => {
  const platform = state.search.platform;
  const gameId = state.search.gameId;
  const games = state.search.games;
  const activities = state.search.activities;
  const activity = state.search.activity;

  return {
    platform,
    gameId,
    games,
    activities,
    activity
  };
};

export default connect(mapStateToProps)(GamingSessionCreate);
