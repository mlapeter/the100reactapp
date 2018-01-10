import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";

import styles from "./styles";
import moment from "../../../node_modules/moment";

var t = require("tcomb-form-native");
var Form = t.form.Form;

export default class GamingSessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const newActivities = toObject(this.props.activities);
    const finalActivities = t.enums(newActivities);
    const newGroups = toObject(this.props.groups);
    const finalGroups = t.enums(newGroups);

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
      group: t.maybe(finalGroups),
      friends_only: t.Boolean,
      group_only: t.Boolean
    });

    var value = {
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
              <Form ref="form" type={GamingSession} options={options} />
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
