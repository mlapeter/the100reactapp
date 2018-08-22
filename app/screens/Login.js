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
import { Container } from "../components/Container";

import { KeyboardAvoidingScrollView } from "../components/KeyboardAvoidingScrollView";

import PreSplash from "../components/PreSplash/PreSplash";
import MenuDrawer from "../router/index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchToken } from "../actions/authentication";
import { decodeToken } from "../actions/authentication";
import { setFirebaseToken } from "../actions/authentication";
import { changeSelectedGroupId, fetchGroup } from "../actions/group";

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
    setTimeout(() => {
      AsyncStorage.getItem("default_group_id").then(groupId => {
        console.log("default_group_id: ", groupId);
        if (groupId) {
          this.props.dispatch(changeSelectedGroupId(groupId));
        } else {
          this.props.dispatch(fetchGroup());
        }
      });
    }, 2000);
  }

  render() {
    return (
      <KeyboardAvoidingScrollView>
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
            autoCapitalize="none"
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            maxLength={100}
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
            autoCapitalize="none"
            ref={input => {
              this.secondTextInput = input;
            }}
            maxLength={100}
          />

          {this.props.authentication.isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Button
              style={{
                height: 80,
                width: 300,
                padding: 15,
                marginBottom: 15
              }}
              onPress={() => this.userLogin(this)}
              title="Login"
            />

            // <TouchableOpacity style={{}} onPress={this.userLogin.bind(this)}>
            //   <Text
            //     style={{
            //       textAlign: "center",
            //       padding: 15,
            //       fontFamily: fontStyles.primaryFont,
            //       fontSize: fontSizes.primary,
            //       height: 80,
            //       width: 300,
            //       marginBottom: 15
            //     }}
            //   >
            //     Login
            //   </Text>
            // </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    width: "100%",
    paddingVertical: 10
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
