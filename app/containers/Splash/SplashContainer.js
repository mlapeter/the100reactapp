import React, { PropTypes } from "react";
import { Alert, Button, View, Text } from "react-native";

import Splash from "../../components/Splash/Splash";

export default class SplashContainer extends React.Component {
  static navigationOptions = {
    title: "Splash Container"
  };

  handeLoginFinished = () => {
    Alert.alert("Your now pretend logged in!");
  };

  render() {
    return <Splash onLoginFinished={this.handeLoginFinished} />;
  }
}
