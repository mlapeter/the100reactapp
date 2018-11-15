import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchToken } from "../actions/authentication";
import { resetPassword } from "../actions/authentication";

import { colors, fontSizes, fontStyles } from "../styles";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null
    };
  }

  componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Forgot Password"))
      .catch(e => console.log(e.message));
  }

  componentWillReceiveProps(nextProps) {
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
  }

  submitEmail = () => {
    if (!this.state.email) return;
    console.log("Submitting PW Reset");
    this.props.dispatch(resetPassword(this.state.email));
    this.setState({
      email: ""
    });
    this.props.navigation.navigate("Login");
  };

  render() {
    if (this.props.authentication.resettingPassword) {
      return <ActivityIndicator />;
    } else {
      return (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          getTextInputRefs={() => {
            return [this._textInputRef];
          }}
        >
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={require("../assets/images/logo.png")}
            />
            <TextInput
              onChangeText={email => this.setState({ email })}
              placeholder="Email"
              ref="email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={this.state.email}
              underlineColorAndroid={"transparent"}
              maxLength={100}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.submitEmail()}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: colors.veryDarkGrey
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
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: colors.primaryBlue,
    borderRadius: 3,
    width: 300
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

export default connect(mapStateToProps)(connectAlert(ForgotPassword));
