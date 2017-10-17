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
    this.fetchData();
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

  fetchData() {
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

    var User = t.struct({
      gamertag: t.maybe(t.String)
    });

    var value = {
      gamertag: this.props.user.gamertag
      // activity: "Raid - Leviathan - Normal"
      // created_by: "mobile-app"
    };

    var options = {
      fields: {
        // gamertag: {
        //   value: this.props.user.gamertag
        // }
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

  // const isUpdating = state.users.isUpdating;

  return {
    authedUser,
    user,
    userError: state.users.error,
    userUpdated: state.users.userUpdated
  };
};

export default connect(mapStateToProps)(connectAlert(UserEdit));
