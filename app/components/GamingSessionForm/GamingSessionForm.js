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

var t = require("tcomb-form-native");
var Form = t.form.Form;

export default class GamingSessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewGames: false,
      advancedOptions: false
    };
  }

  toggleGames() {
    this.setState({
      viewGames: !this.state.viewGames
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  toggleAdvancedOptions() {
    this.setState({
      advancedOptions: !this.state.advancedOptions
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  render() {
    let newActivities = toObject(this.props.activities);
    let finalActivities = t.enums(newActivities);
    let newGroups = toObject(this.props.groups);
    const finalGroups = t.enums(newGroups);

    function toObject(arr) {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        rv[arr[i].toString()] = arr[i].toString();
      return rv;
    }

    if (this.state.advancedOptions) {
      var GamingSession = t.struct({
        activity: finalActivities,
        description: t.maybe(t.String),
        start_time: t.Date,
        group: t.maybe(finalGroups),
        friends_only: t.Boolean,
        group_only: t.Boolean,
        team_size: t.maybe(t.Number)
      });
    } else {
      var GamingSession = t.struct({
        activity: finalActivities,
        description: t.maybe(t.String),
        start_time: t.Date,
        group: t.maybe(finalGroups),
        friends_only: t.Boolean,
        group_only: t.Boolean
      });
    }
    console.log("PROPS: ");
    console.log(this.props);
    if (this.props.gamingSession) {
      var value = {
        activity: this.props.gamingSession.category,
        description: this.props.gamingSession.name,
        start_time: new Date(this.props.gamingSession.start_time),
        group: this.props.gamingSession.group_name,
        friends_only: this.props.gamingSession.friends_only,
        group_only: this.props.gamingSession.group_only
      };
    } else {
      var value = {
        created_by: "mobile-app"
      };
    }

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

    function Toggle(props) {
      return (
        <View style={styles.icon}>
          <TouchableHighlight onPress={props.toggle} underlayColor="white">
            <Text style={styles.iconText}>
              {props.title}{" "}
              <MaterialCommunityIcons
                name="settings"
                size={15}
                color={colors.mediumGrey}
              />
            </Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (this.props.isCreating) {
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
              {this.props.editGameForm === true ? null : (
                <Toggle
                  title={this.props.game.name}
                  toggle={() => this.toggleGames()}
                />
              )}

              {this.state.viewGames ? (
                <View>
                  <Picker
                    style={styles.pickerStyle}
                    selectedValue={
                      this.props.gamingSession
                        ? this.props.gamingSession.game_id
                        : this.props.gameId
                    }
                    onValueChange={gameId => {
                      this.props.changeGame(gameId);
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
              ) : // <Picker
              //   selectedValue={
              //     this.props.gamingSession
              //       ? this.props.gamingSession.game_id
              //       : this.props.gameId
              //   }
              //   onValueChange={gameId => {
              //     this.props.changeGame(gameId);
              //   }}
              // >
              //   {this.props.games.map(game => (
              //     <Picker.Item
              //       key={game.id}
              //       label={game.name.toString()}
              //       value={game.id}
              //     />
              //   ))}
              // </Picker>
              null}

              <Form
                ref="form"
                type={GamingSession}
                options={options}
                value={value}
                advancedOptions={this.state.advancedOptions}
              />
              <Toggle
                title="Advanced Options"
                toggle={() => this.toggleAdvancedOptions()}
              />
              <TouchableHighlight
                style={styles.button}
                onPress={() =>
                  this.props.handlePress(this.refs.form.getValue())}
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
