import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Keyboard,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import { Container } from "../components/Container";
import PreSplash from "../components/PreSplash/PreSplash";
import { KeyboardAvoidingScrollView } from "../components/KeyboardAvoidingScrollView";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchToken } from "../actions/authentication";

import { colors, fontSizes, fontStyles } from "../styles";

import * as Linking from 'expo-linking';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null
    };
  }

  UNSAFE_componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Login"))
      .catch(e => console.log(e.message));
  }

  componentDidUpdate() {
    if (this.props.users.currentUser && this.props.users.currentUser.gamertag) {
      this.props.navigation.navigate("App");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.authentication.error &&
      nextProps.authentication.errorAt !== this.props.authentication.errorAt
    ) {
      this.props.alertWithType(
        "error",
        "Error",
        nextProps.authentication.error
      );
    }
    if (
      nextProps.authentication.success &&
      nextProps.authentication.successAt !== this.props.authentication.successAt
    ) {
      this.props.alertWithType("success", "", nextProps.authentication.success);
    }
  }

  userLogin() {
    if (!this.state.username || !this.state.password) return;
    this.props.dispatch(fetchToken(this.state.username, this.state.password, null));
    this.setState({
      username: "",
      password: ""
    });
  }

  render() {
    return (
      <View style={styles.outerContainer}>
        <KeyboardAvoidingScrollView>
          <View style={styles.container}>
            <TextInput
              onChangeText={username => this.setState({ username })}
              placeholder="Username"
              placeholderStyle={{ color: colors.darkGrey }}
              ref="username"
              textContentType="username"
              returnKeyType="next"
              style={styles.input}
              value={this.state.username}
              underlineColorAndroid={"transparent"}
              autoCapitalize="none"
              onSubmitEditing={() => {
                this.secondTextInput.focus();
              }}
              maxLength={100}
            />
            <TextInput
              onChangeText={password => this.setState({ password })}
              placeholder="Password"
              placeholderStyle={{ color: colors.darkGrey }}
              ref="password"
              textContentType="password"
              secureTextEntry={true}
              style={styles.input}
              value={this.state.password}
              underlineColorAndroid={"transparent"}
              autoCapitalize="none"
              ref={input => {
                this.secondTextInput = input;
              }}
              maxLength={100}
            />
            {this.props.authentication.isLoading ? (
              <ActivityIndicator />
            ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.userLogin(this)}
                >
                  <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
              )}
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => this.props.navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.buttonText}>email me instant login link</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.veryDarkGrey
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 15
  },
  slogan: {
    fontSize: 40,
    margin: 20,
    textAlign: "center"
  },
  image: {
    padding: 5,
    resizeMode: "contain",
    height: 150 //height * 0.4 > 300 ? 300 : height * 0.4
  },
  loginContainer: {
    padding: 30,
    alignItems: "center",
    flex: 1
  },
  assuranceText: {
    textAlign: "center"
  },
  buttonStyle: {
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary,
    height: 100,
    width: 200,
    backgroundColor: colors.grey,
    marginBottom: 15
  },
  input: {
    margin: 15,
    padding: 5,
    fontSize: fontSizes.primary,
    borderWidth: 0.5,
    borderColor: colors.grey,
    height: 50,
    width: 300,
    flexDirection: "row",
    backgroundColor: colors.white,
    color: colors.veryDarkGrey,
    borderRadius: 2
  },
  button: {
    margin: 15,
    padding: 5,
    paddingVertical: 20,
    backgroundColor: colors.primaryBlue,
    borderRadius: 3,
    width: 300
  },
  forgotButton: {
    marginTop: 20,
    paddingVertical: 20
  },
  buttonText: {
    color: colors.white,
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  const authentication = state.authentication;
  const users = state.users;

  return {
    authentication,
    users
  };
};

export default connect(mapStateToProps)(connectAlert(Login));
