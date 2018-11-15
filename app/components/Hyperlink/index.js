// @flow

type Props = {
  link: string,
  text: string
};

import React, { PureComponent } from "react";
import { Linking, StyleSheet, Text } from "react-native";

export default class Hyperlink extends PureComponent<Props> {
  onPress = () => {
    Linking.openURL(this.props.link).catch(e => {
      console.log("Failed to open link: " + e);
    });
  };

  render() {
    let { link, text, ...props } = this.props;
    return (
      <Text style={styles.link} onPress={this.onPress} {...props}>
        {text || link}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: "#337ab7"
  }
});
