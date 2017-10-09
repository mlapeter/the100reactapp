import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  Keyboard,
  ListView,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";
var t = require("tcomb-form-native");

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import moment from "../../node_modules/moment";

import PreSplash from "../components/PreSplash/PreSplash";

import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

import { createGamingSession } from "../actions/gamingSessions";
import { changeGame } from "../actions/search";

// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

var Form = t.form.Form;

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
      // this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("success", "Success", "Gaming Session Created!");
    }
  }

  handlePress() {
    var value = this.refs.form.getValue();
    if (value) {
      // if validation fails, value will be null
      this.props.dispatch(createGamingSession(value));
    }
  }

  render() {
    if (this.props.isCreating) {
      return (
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <PreSplash />
          </View>
        </View>
      );
    }

    const newActivities = toObject(this.props.activities);
    const finalActivities = t.enums(newActivities);

    function toObject(arr) {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        rv[arr[i].toString()] = arr[i].toString();
      return rv;
    }

    var GamingSession = t.struct({
      activity: finalActivities,
      description: t.maybe(t.String),
      start_time: t.Date,
      friends_only: t.Boolean,
      group_only: t.Boolean
    });

    var value = {
      // activity: "Raid - Leviathan - Normal"
      created_by: "mobile-app"
    };

    var options = {
      fields: {
        activity: {
          label: "Activity"
        },
        start_time: {
          config: {
            format: date => moment(date).format("hh:mm A  MM/DD/YY")
          },
          mode: "datetime",
          blurOnSubmit: true
        },
        created_by: {
          hidden: true
        }
      }
    };
    return (
      <View style={styles.outerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.container}>
              <Form ref="form" type={GamingSession} options={options} />
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.handlePress()}
                underlayColor="#99d9f4"
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableHighlight>
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
  }
});

const mapStateToProps = state => {
  const platform = state.search.platform;
  const gameId = state.search.gameId;
  const games = state.search.games;
  const activities = state.search.activities;
  const activity = state.search.activity;
  const isCreating = state.gamingSessions.isCreating;

  return {
    platform,
    gameId,
    games,
    activities,
    activity,
    isCreating,
    gameCreated: state.gamingSessions.gameCreated,
    gamingSessionError: state.gamingSessions.error
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionCreate));
