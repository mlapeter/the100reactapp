import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, SafeAreaView, Platform } from "react-native";

import styles from "./styles";

class Container extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    if (Platform.OS === "ios") {
      return (
        <SafeAreaView style={styles.container}>
          {this.props.children}
        </SafeAreaView>
      );
    } else {
      return <View style={styles.container}>{this.props.children}</View>;
    }
  }
}

export default Container;
