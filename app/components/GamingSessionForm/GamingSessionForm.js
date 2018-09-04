import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  Keyboard,
  LayoutAnimation,
  Picker,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes, fontStyles } from "../../styles";
import styles from "./styles";
import moment from "../../../node_modules/moment";
import Toggle from "../Toggle";

var t = require("tcomb-form-native");
var Form = t.form.Form;

export default class GamingSessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewGames: false,
      advancedOptions: false,
      formData: null,
      loading: true,
      game: null,
      activities: null,
      selectedActivity: this.props.gamingSession
        ? this.props.gamingSession.category
        : null
    };
  }

  componentWillMount() {
    if (this.props.gameId) {
      this.fetchActivities(this.props.gameId);
    }
  }

  switchActivities = gameId => {
    this.setState(
      {
        selectedActivity: null
      },
      () => {
        this.fetchActivities(gameId);
      }
    );
  };

  fetchActivities = gameId => {
    console.log("FETCHING ACTIVITIES IN FORM, GAME ID: ", gameId);
    this.setState({
      loading: true
    });

    let game = this.props.games.find(function(game) {
      return game.id === gameId;
    });
    console.log("Game: ", game);
    let activities = game.activities.sort((a, b) => a.localeCompare(b));
    this.setState(
      {
        game: game,
        activities: activities
      },
      () => {
        this.setState({
          loading: false
        });
      }
    );
  };

  toggleGames() {
    this.setState({
      viewGames: !this.state.viewGames
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  toggleAdvancedOptions() {
    let formValue = this.refs.form.getValue();
    console.log(formValue);
    if (formValue) {
      console.log("setting form data");
      this.setState({
        advancedOptions: !this.state.advancedOptions,
        formData: formValue,
        selectedActivity: formValue.activity
      });
    } else {
      console.log("not setting form data");
      this.setState({
        advancedOptions: !this.state.advancedOptions
      });
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  render() {
    var Platform = t.enums({
      ps4: "PS4",
      "xbox-one": "XBOX ONE",
      pc: "PC"
    });

    let newActivities = toObject(this.state.activities);
    let finalActivities = t.enums(newActivities);

    let newGroups = { "": "" };
    if (this.props.groups) {
      newGroups = toObject(this.props.groups);
    }
    const finalGroups = t.enums(newGroups);

    function toObject(arr) {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        rv[arr[i].toString()] = arr[i].toString();
      return rv;
    }

    var GamingSession = t.struct({
      game_id: t.maybe(t.Number),
      activity: t.maybe(finalActivities),
      description: t.maybe(t.String),
      start_time: t.maybe(t.Date),
      group: t.maybe(finalGroups),
      friends_only: t.maybe(t.Boolean),
      group_only: t.maybe(t.Boolean),
      make_auto_public: t.maybe(t.Boolean),
      beginners_welcome: t.maybe(t.Boolean),
      sherpa_requested: t.maybe(t.Boolean),
      mic_required: t.maybe(t.Boolean),
      party_size: t.maybe(t.Number),
      platform: t.maybe(Platform)
    });

    if (this.state.formData) {
      console.log("form data found");
      // If form partially filled out and user clicks advanced options
      var value = {
        // activity: this.state.formData.activity,
        game_id: this.state.game.id,
        activity: this.state.selectedActivity,
        description: this.state.formData.description,
        start_time: this.state.formData.start_time,
        group: this.state.formData.group,
        friends_only: this.state.formData.friends_only,
        group_only: this.state.formData.group_only,
        make_auto_public: this.state.formData.make_auto_public,
        beginners_welcome: this.state.formData.beginners_welcome,
        sherpa_requested: this.state.formData.sherpa_requested,
        mic_required: this.state.formData.mic_required,
        party_size: this.state.formData.party_size,
        platform: this.state.formData.platform,
        created_by: "mobile-app"
      };
    } else if (this.props.gamingSession) {
      console.log("GAMING SESSION FOUND:");
      // If user is editing existing gaming session
      var value = {
        game_id: this.state.game.id,
        activity: this.state.selectedActivity,
        description: this.props.gamingSession.name,
        start_time: new Date(this.props.gamingSession.start_time),
        group: this.props.gamingSession.group_name,
        friends_only: this.props.gamingSession.friends_only,
        group_only: this.props.gamingSession.group_only,
        make_auto_public: this.props.gamingSession.make_auto_public,
        beginners_welcome: this.props.gamingSession.beginners_welcome,
        sherpa_requested: this.props.gamingSession.sherpa_requested,
        mic_required: this.props.gamingSession.mic_required,
        party_size: this.props.gamingSession.party_size,
        platform: this.props.gamingSession.platform
      };
    } else {
      console.log("new game form");
      // If user is creating new game
      var value = {
        game_id: this.state.game.id,
        platform: this.props.user.platform,
        start_time: new Date(),
        mic_required: true,
        created_by: "mobile-app"
      };
    }

    var options = {
      fields: {
        activity: {
          label: "Activity"
        },
        description: {
          label: "Description"
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
        },
        game_id: {
          hidden: true
        },
        group: {
          hidden: !this.props.groups
        },
        make_auto_public: {
          hidden: !this.state.advancedOptions
        },
        beginners_welcome: {
          hidden: !this.state.advancedOptions
        },
        sherpa_requested: {
          hidden: !this.state.advancedOptions
        },
        mic_required: {
          hidden: !this.state.advancedOptions
        },
        party_size: {
          hidden: !this.state.advancedOptions
        },
        platform: {
          hidden: !this.state.advancedOptions
        }
      }
    };

    if (
      this.props.isCreating ||
      this.props.isEditing ||
      !this.props.user ||
      this.state.loading
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
          {/* <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          > */}
          <View style={styles.container}>
            <Toggle
              title={this.state.game.name}
              toggle={() => this.toggleGames()}
            />

            {this.state.viewGames ? (
              <View>
                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.state.game.id}
                  onValueChange={gameId => {
                    this.switchActivities(gameId);
                  }}
                >
                  {this.props.games.map(game => (
                    <Picker.Item
                      key={game.id}
                      label={game.name.toString()}
                      value={game.id}
                    />
                  ))}
                </Picker>
              </View>
            ) : null}

            <Form
              ref="form"
              type={GamingSession}
              options={options}
              value={value}
            />
            <Toggle
              title="Advanced Options"
              toggle={() => this.toggleAdvancedOptions()}
            />
            <TouchableHighlight
              style={styles.button}
              onPress={() => {
                this.props.handlePress(this.refs.form.getValue());
              }}
              underlayColor="#99d9f4"
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </ScrollView>
      </View>
    );
  }
}
