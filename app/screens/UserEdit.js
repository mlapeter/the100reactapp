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
  TouchableOpacity,
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
import { removeToken } from "../actions/authentication";

import { connectAlert } from "../components/Alert";
import { fetchUser } from "../actions/users";
import { updateUser } from "../actions/users";

import { firebaseSignOut } from "../utils/user";

// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

var Form = t.form.Form;

class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.fetchUserEditData(this.props.authedUser);
    console.log(this.props.authedUser);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.error && nextProps.users.error === "Not Authorized") {
      this.props.alertWithType(
        "error",
        "Error",
        "Error connecting to server, please login again."
      );
      this.userLogout();
    }
    if (
      nextProps.users.error &&
      nextProps.users.errorAt !== this.props.users.errorAt
    ) {
      this.props.alertWithType("error", "Error", nextProps.users.error);
    }
    if (
      nextProps.users.success &&
      nextProps.users.successAt !== this.props.users.successAt
    ) {
      this.props.alertWithType("success", "Success", "Profile Updated");
      this.props.navigation.navigate("Home");
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

  userLogout() {
    // try {
    //   AsyncStorage.removeItem("id_token");
    // } catch (error) {
    //   console.log("AsyncStorage error: " + error.message);
    // }
    firebaseSignOut();
    this.props.dispatch(removeToken());
    this.props.navigation.navigate("Login");
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
      casual: "Casual / having fun is priority",
      serious: "Serious"
    });

    var PlaySchedule = t.enums({
      "Weekday Mornings and Weekends": "Weekday Mornings and Weekends",
      "Weekday Afternoons and Weekends": "Weekday Afternoons and Weekends",
      "Weekday Evenings and Weekends": "Weekday Evenings and Weekends",
      "Weekdays Latenight and Weekends": "Weekdays Latenight and Weekends"
    });

    var Gender = t.enums({
      Male: "Male",
      Female: "Female",
      Other: "Other"
    });

    let profanityOk = this.props.user.profanity_ok === "yes";
    console.log(this.props.user);

    var User = t.struct({
      gamertag: t.String,
      platform: Platform,
      xbox_live_id: t.maybe(t.String),
      psn_id: t.maybe(t.String),
      xbox_windows_id: t.maybe(t.String),
      steam_id: t.maybe(t.String),
      battle_net_id: t.maybe(t.String),
      uplay_id: t.maybe(t.String),
      description: t.maybe(t.String),
      light_level: t.maybe(t.Number),
      headset: t.Boolean,
      play_schedule: PlaySchedule,
      play_style: PlayStyle,
      profanity_ok: t.Boolean,
      gender: Gender,
      age: t.Number,
      hide_sherpa_badge: t.Boolean,
      discord_linked: t.Boolean,
      charlemagne_linked: t.Boolean,
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
      xbox_live_id: this.props.user.xbox_live_id,
      psn_id: this.props.user.psn_id,
      xbox_windows_id: this.props.user.xbox_windows_id,
      steam_id: this.props.user.steam_id,
      battle_net_id: this.props.user.battle_net_id,
      uplay_id: this.props.user.uplay_id,
      description: this.props.user.description,
      light_level: this.props.user.light_level,
      headset: this.props.user.headset,
      play_schedule: this.props.user.play_schedule,
      play_style: this.props.user.play_style,
      profanity_ok: profanityOk,
      gender: this.props.user.gender,
      age: this.props.user.age,
      hide_sherpa_badge: this.props.user.hide_sherpa_badge,
      discord_linked: this.props.user.discord_linked,
      charlemagne_linked: this.props.user.charlemagne_linked,
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
        description: {
          type: "textarea",
          multiline: true,
          stylesheet: {
            ...Form.stylesheet,
            textbox: {
              ...Form.stylesheet.textbox,
              normal: {
                ...Form.stylesheet.textbox.normal,
                height: 150,
                textAlignVertical: "top"
              },
              error: {
                ...Form.stylesheet.textbox.error,
                height: 150
              }
            }
          }
        },
        light_level: {
          label: "Guardian Power Level"
        },
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
              <View style={styles.logoutContainer}>
                <Button onPress={() => this.userLogout()} title="Log Out" />
              </View>
              <Form ref="form" type={User} options={options} value={value} />
              <View style={styles.emailNoteContainer}>
                <Text style={styles.emailNoteText}>
                  note: email can only be changed on the website.
                </Text>
              </View>
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
  const authedUser = state.authentication.user;
  const user = state.users.user;
  const users = state.users;
  const isUpdating = state.users.isUpdating;
  const userLoading = state.users.userLoading;

  // const isUpdating = state.users.isUpdating;

  return {
    authedUser,
    user,
    users,
    isUpdating,
    userLoading
    // userError: state.users.error,
    // userUpdated: state.users.userUpdated
  };
};

export default connect(mapStateToProps)(connectAlert(UserEdit));
