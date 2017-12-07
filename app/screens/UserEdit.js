import React, { Component } from "react";
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
import { fetchUser } from "../actions/users";
import { updateUser } from "../actions/users";

// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

var Form = t.form.Form;

class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.fetchUserEditData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userError && nextProps.userError !== this.props.userError) {
      this.props.alertWithType("error", "Error", nextProps.userError);
    }
    if (
      nextProps.userUpdated &&
      nextProps.userUpdated !== this.props.userUpdated
    ) {
      this.props.alertWithType("success", "Success", "Profile Updated");
      this.props.navigation.navigate("GamingSessionsList");
    }
  }

  fetchUserEditData() {
    console.log("Fetching User");
    this.props.dispatch(fetchUser(this.props.authedUser.user_id));
  }

  handlePress() {
    var value = this.refs.form.getValue();
    if (value) {
      // if validation fails, value will be null
      this.props.dispatch(updateUser(value));
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

    var Platform = t.enums({
      ps4: "PS4",
      "xbox-one": "XBOX ONE",
      pc: "PC"
    });

    var PlayStyle = t.enums({
      casual: "Casual",
      serious: "Serious"
    });

    var PlaySchedule = t.enums({
      "Weekday Mornings and Weekends": "Weekday Mornings and Weekends",
      "Weekday Afternoons and Weekends": "Weekday Afternoons and Weekends",
      "Weekday Evenings and Weekends": "Weekday Evenings and Weekends"
    });

    var User = t.struct({
      gamertag: t.String,
      platform: Platform,
      play_style: PlayStyle,
      play_schedule: PlaySchedule,
      light_level: t.Number,
      age: t.Number,
      push_new_group_game: t.Boolean,
      push_new_friend_game: t.Boolean,
      push_player_joined_left: t.Boolean,
      push_game_time_changed: t.Boolean,
      push_username_mention: t.Boolean,
      push_karma_received: t.Boolean,
      push_private_message_received: t.Boolean,
      push_game_reminder: t.Boolean,
      no_emails: t.Boolean,
      no_push_notifications: t.Boolean
    });

    var value = {
      gamertag: this.props.user.gamertag,
      platform: this.props.user.platform,
      play_style: this.props.user.play_style,
      play_schedule: this.props.user.play_schedule,
      light_level: this.props.user.light_level,
      age: this.props.user.age,
      no_emails: this.props.user.no_emails,
      no_push_notifications: this.props.user.no_push_notifications,
      push_new_group_game: this.props.user.push_new_group_game,
      push_new_friend_game: this.props.user.push_new_friend_game,
      push_player_joined_left: this.props.user.push_player_joined_left,
      push_game_time_changed: this.props.user.push_game_time_changed,
      push_username_mention: this.props.user.push_username_mention,
      push_karma_received: this.props.user.push_karma_received,
      push_private_message_received: this.props.user
        .push_private_message_received,
      push_game_reminder: this.props.user.push_game_reminder
    };

    var options = {
      fields: {
        no_emails: {
          label: "Turn off ALL emails"
        },
        no_push_notifications: {
          label: "Turn off ALL push notifications"
        }
      }
    };
    if (this.props.userLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.props.isUpdating) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
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
              <Form ref="form" type={User} options={options} value={value} />
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
  const authedUser = state.authentication.user;
  const user = state.users.user;
  const isUpdating = state.users.isUpdating;
  const userLoading = state.users.userLoading;

  // const isUpdating = state.users.isUpdating;

  return {
    authedUser,
    user,
    isUpdating,
    userLoading,
    userError: state.users.error,
    userUpdated: state.users.userUpdated
  };
};

export default connect(mapStateToProps)(connectAlert(UserEdit));
