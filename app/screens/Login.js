import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { StackNavigator } from "react-navigation";
import { TabNavigator } from "react-navigation";
import PreSplash from "../components/PreSplash/PreSplash";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

import { fetchToken } from "../actions/authentication";
import { decodeToken } from "../actions/authentication";

import Navigator from "../config/routes";

import { colors, fontSizes } from "../styles";
const { height, width } = Dimensions.get("window");

class Login extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      isLoaded: false
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.authenticationError &&
      nextProps.authenticationError !== this.props.authenticationError
    ) {
      this.props.alertWithType("error", "Error", nextProps.authenticationError);
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("id_token").then(token => {
      this.props.dispatch(decodeToken(token));
      this.setState({ isLoaded: true });
    });
  }

  userLogin() {
    if (!this.state.username || !this.state.password) return;
    Keyboard.dismiss();
    this.props.dispatch(fetchToken(this.state.username, this.state.password));
  }

  userLogout() {
    try {
      AsyncStorage.removeItem("id_token");
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
    this.props.dispatch(removeToken());
  }

  static navigationOptions = {
    title: "Welcome"
  };

  render() {
    if (!this.state.isLoaded) {
      return <PreSplash />;
    }

    if (this.props.authentication.isAuthed === true) {
      return <Navigator onNavigationStateChange={null} />;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={require("../images/logo.png")} />
          <KeyboardAvoidingView
            style={styles.loginContainer}
            behavior="padding"
            keyboardVerticalOffset={100}
          >
            <TextInput
              onChangeText={username => this.setState({ username })}
              placeholder="Username"
              ref="username"
              returnKeyType="next"
              style={styles.input}
              value={this.state.username}
            />

            <TextInput
              onChangeText={password => this.setState({ password })}
              placeholder="Password"
              ref="password"
              secureTextEntry={true}
              style={styles.input}
              value={this.state.password}
            />
            <Button
              style={{
                height: 30,
                width: 180,
                marginBottom: 15
              }}
              onPress={this.userLogin.bind(this)}
              title="Login"
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 40
  },
  slogan: {
    color: colors.blue,
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
    alignItems: "center"
  },
  assuranceText: {
    color: colors.secondary,
    fontSize: fontSizes.secondary,
    textAlign: "center"
  },
  input: {
    margin: 5,
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    flexDirection: "row",
    flex: 5
  }
});

const mapStateToProps = state => {
  const authentication = state.authentication;
  // const onAuthChange = state.authentication.onAuthChange(token);

  return {
    authentication,
    authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(Login));
