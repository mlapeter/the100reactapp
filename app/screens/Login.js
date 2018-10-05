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
import { Container } from "../components/Container";

// import { KeyboardAvoidingScrollView } from "../components/KeyboardAvoidingScrollView";

import PreSplash from "../components/PreSplash/PreSplash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchToken } from "../actions/authentication";
import { decodeToken } from "../actions/authentication";
import { setFirebaseToken } from "../actions/authentication";
import { changeSelectedGroupId, fetchGroup } from "../actions/group";

import { colors, fontSizes, fontStyles } from "../styles";
// const { height, width } = Dimensions.get("window");

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

  componentWillMount() {}

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

  userLogin() {
    if (!this.state.username || !this.state.password) return;
    this.props.dispatch(fetchToken(this.state.username, this.state.password));
    this.setState({
      username: "",
      password: ""
    });
    // setTimeout(() => {
    //   AsyncStorage.getItem("default_group_id").then(groupId => {
    //     console.log("default_group_id: ", groupId);
    //     if (groupId) {
    //       this.props.dispatch(changeSelectedGroupId(groupId));
    //     } else {
    //       this.props.dispatch(fetchGroup());
    //     }
    //   });
    // }, 2000);
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../assets/images/logo.png")}
          />
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
            // <Button
            //     style={{
            //     height: 80,
            //     width: 300,
            //     padding: 15,
            //     marginBottom: 15
            //   }}
            //   onPress={() => this.userLogin(this)}
            //   title="Login"
            // />

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
      </KeyboardAwareScrollView>
    );
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

export default connect(mapStateToProps)(connectAlert(Login));
