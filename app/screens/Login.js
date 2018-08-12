import React, { Component } from "react";
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
// import { Analytics, PageHit } from "expo-analytics";
import PreSplash from "../components/PreSplash/PreSplash";
import MenuDrawer from "../router/index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchToken } from "../actions/authentication";
import { decodeToken } from "../actions/authentication";
import { setFirebaseToken } from "../actions/authentication";

import { colors, fontSizes, fontStyles } from "../styles";
const { height, width } = Dimensions.get("window");

class Login extends React.Component {
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

  componentWillMount() {
    // const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    // analytics.hit(new PageHit("App Login"));
    // if (this.props.authentication.isAuthed === true) {
    //   this.props.navigation.navigate("Main");
    // }
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
    if (nextProps.users.currentUser && nextProps.authentication.isAuthed) {
      this.props.navigation.navigate("App");
    }
  }

  // setTimeout(() => {
  //   if (
  //     this.props.authentication.isAuthed === true &&
  //     this.props.users.currentUser.gamertag != null
  //   ) {
  //     this.props.navigation.navigate("App");
  //   } else {
  //     this.props.navigation.navigate("Auth");
  //   }
  // }, 3000);

  userLogin() {
    if (!this.state.username || !this.state.password) return;
    this.props.dispatch(fetchToken(this.state.username, this.state.password));
    this.setState({
      username: "",
      password: ""
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={10}
        keyboardOpeningTime={10}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../assets/images/logo.png")}
          />

          <TextInput
            onChangeText={username => this.setState({ username })}
            placeholder="Username"
            ref="username"
            textContentType="username"
            returnKeyType="next"
            style={styles.input}
            value={this.state.username}
            underlineColorAndroid={"transparent"}
          />

          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            ref="password"
            textContentType="password"
            secureTextEntry={true}
            style={styles.input}
            value={this.state.password}
            underlineColorAndroid={"transparent"}
          />

          {this.props.authentication.isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <TouchableOpacity style={{}} onPress={this.userLogin.bind(this)}>
              <Text
                style={{
                  textAlign: "center",
                  padding: 15,
                  fontFamily: fontStyles.primaryFont,
                  fontSize: fontSizes.primary,
                  height: 80,
                  width: 300,
                  marginBottom: 15
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 40
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
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    height: 50,
    width: 300,
    flexDirection: "row"
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
