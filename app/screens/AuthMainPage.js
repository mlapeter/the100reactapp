import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Dimensions
} from "react-native";
import * as Font from 'expo-font'
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import PreSplash from "../components/PreSplash/PreSplash";
import { colors } from "../styles";
import ImgLogo from "../assets/images/logo.png";
import { KeyboardAvoidingScrollView } from "../components/KeyboardAvoidingScrollView";


const { width, height } = Dimensions.get("window");

class AuthMainPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Auth Main Page"))
      .catch(e => console.log(e.message));
  }

  componentDidUpdate() {
    console.log("componentDidUpdate authmainpage")
    if (this.props.users.currentUser && this.props.users.currentUser.gamertag) {
      this.props.navigation.navigate("App");
    }
  }

  render() {
    if (this.props.authentication.isLoading) {
      return <PreSplash />;
    }

    return (
      <KeyboardAvoidingScrollView>

        <ScrollView contentContainerStyle={styles.container}>
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
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingScrollView>

    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
    backgroundColor: colors.veryDarkGrey
  },
  logoImage: {
    marginVertical: height * 0.1,
    // width: width * 0.6,
    // height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300
  },
  loginButton: {
    paddingVertical: 20,
    backgroundColor: colors.darkGrey,
    alignSelf: "stretch",
    borderRadius: 3,
    borderColor: "#18191b",
    borderWidth: 0.5
  },
  signupButton: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: colors.primaryBlue,
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
  const users = state.users;

  return {
    authentication,
    users
  };
};
export default connect(mapStateToProps)(connectAlert(AuthMainPage));
