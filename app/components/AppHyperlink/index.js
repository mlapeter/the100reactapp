import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Linking, StyleSheet, Text } from "react-native";

export default class AppHyperlink extends PureComponent {
  static propTypes = {
    link: PropTypes.string.isRequired,
    text: PropTypes.string
  };

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
    color: "blue",
    textDecorationLine: "underline"
  }
});
