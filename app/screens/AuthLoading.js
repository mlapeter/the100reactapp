import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { decodeToken, setFirebaseToken } from "../actions/authentication";

class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrap();
  }

  bootstrap = () => {
    Font.loadAsync({
      Lato: require("../../app/assets/fonts/Lato-Bold.ttf"),
      Nunito: require("../../app/assets/fonts/Nunito-Bold.ttf")
    }).then(result => {
      AsyncStorage.getItem("fb_token").then(token => {
        this.props.dispatch(setFirebaseToken(token));
      });
      AsyncStorage.getItem("id_token").then(token => {
        this.props.dispatch(decodeToken(token));
        if (this.props.authentication.isAuthed === true) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Auth");
        }
      });
    });
  };

  // Fetch the token from storage then navigate to our appropriate place
  // _bootstrapAsync = async () => {
  //   const userToken = await AsyncStorage.getItem("userToken");
  //
  //   // This will switch to the App screen or Auth screen and this loading
  //   // screen will be unmounted and thrown away.
  //   this.props.navigation.navigate(userToken ? "App" : "Auth");
  // };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const authentication = state.authentication;
  // const onAuthChange = state.authentication.onAuthChange(token);

  return {
    authentication,
    authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(AuthLoading));
