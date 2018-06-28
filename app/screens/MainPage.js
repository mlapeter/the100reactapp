import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

import { decodeToken, setFirebaseToken } from "../actions/authentication";
import PreSplash from "../components/PreSplash/PreSplash";
import { colors } from "../styles";
import ImgLogo from "../assets/images/logo.png";

const { width, height } = Dimensions.get("window");

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }

  componentWillMount() {
    Font.loadAsync({
      Lato: require("../../app/assets/fonts/Lato-Bold.ttf"),
      Nunito: require("../../app/assets/fonts/Nunito-Bold.ttf")
    }).then(result => {
      AsyncStorage.getItem("id_token").then(token => {
        console.log("id_token: ", token);
        this.props.dispatch(decodeToken(token));
        if (this.props.authentication.isAuthed === true) {
          this.props.navigation.navigate("Main");
        }
        this.setState({ isLoaded: true });
      });
      AsyncStorage.getItem("fb_token").then(token => {
        console.log("getting fb_token: ", token);

        this.props.dispatch(setFirebaseToken(token));
      });
    });
  }

  render() {
    if (!this.state.isLoaded || this.props.authentication.isLoading) {
      return <PreSplash />;
    }

    return (
      <View style={styles.container}>
        <StatusBar />
        <Image source={ImgLogo} style={styles.logoImage} />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => this.props.navigation.navigate("ChoosePlatform")}
        >
          <Text style={styles.buttonText}>NEW USER? SIGN UP!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
    backgroundColor: colors.strongBlack
  },
  logoImage: {
    marginVertical: height * 0.1,
    width: width * 0.6,
    height: width * 0.6
  },
  loginButton: {
    paddingVertical: 20,
    backgroundColor: "#25262a",
    alignSelf: "stretch",
    borderRadius: 3
  },
  signupButton: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: "#5a8cf0",
    alignSelf: "stretch",
    borderRadius: 3
  },
  buttonText: {
    color: colors.white,
    textAlign: "center"
  }
};

const mapStateToProps = state => {
  const authentication = state.authentication;
  // const onAuthChange = state.authentication.onAuthChange(token);

  return {
    authentication,
    authenticationError: state.authentication.error
  };
};
export default connect(mapStateToProps)(connectAlert(MainPage));
