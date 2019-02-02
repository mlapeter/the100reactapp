// @flow

import React, { PureComponent } from "react";
import { Linking, StyleSheet, Text } from "react-native";
import { withNavigation } from "react-navigation";

class AppHyperlink extends PureComponent {
  onPress = () => {
    // Linking.openURL(this.props.link).catch(e => {
    //   console.log("Failed to open link: " + e);
    // });
    alert("clicked!");
    this.props.navigation.goBack();
  };

  render() {
    let { link, text, ...props } = this.props;
    return (
      <Text
        style={styles.link}
        onPress={() => {
          props.navigation.navigate("Friend", {
            userId: this.props.link
          });
        }}
        {...props}
      >
        {text || link}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: "#337ab7",
    padding: 25
  }
});

export default withNavigation(AppHyperlink);
