import React, { Component, PropTypes } from "react";
import {
  Alert,
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
import { AsyncStorage } from "react-native";

import { colors, fontSizes } from "../../styles";
const { height, width } = Dimensions.get("window");

export default class Splash extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  userLogin() {
    if (!this.state.username || !this.state.password) return;
    fetch("http://pwn-staging.herokuapp.com/api/v1/sessions/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gamertag: this.state.username,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseData => {
        console.log("LOGGING IN");
        console.log(responseData);
        this.saveItem("id_token", responseData.token);
      })
      .done();
  }

  async userLogout() {
    try {
      await AsyncStorage.removeItem("id_token");
      Alert.alert("Logout Success!");
      Actions.Authentication();
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../images/logo.png")}
          />
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

            <Text style={styles.assuranceText}>Forgot password?</Text>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={this.userLogout}
            >
              <Text style={styles.buttonText}> Log out </Text>
            </TouchableOpacity>
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
    borderBottomColor: "#d6d7da"
  }
});
