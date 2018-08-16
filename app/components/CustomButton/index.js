import React, { Component } from "react";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

import { ColorPropType, Platform, Text, View } from "react-native";
import styles from "./styles";

class CustomButton extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    // accessibilityLabel: PropTypes.string,
    color: ColorPropType,
    onPress: PropTypes.func.isRequired
  };

  render() {
    // const { color, onPress, title } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    if (this.props.color) {
      if (Platform.OS === "ios") {
        textStyles.push({ color: this.props.color });
      } else {
        buttonStyles.push({ backgroundColor: this.props.color });
      }
    }
    // const accessibilityStates = [];
    //
    const formattedTitle =
      Platform.OS === "android"
        ? this.props.title.toUpperCase()
        : this.props.title;
    return (
      <Touchable
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
      >
        <View style={buttonStyles}>
          <Text style={textStyles}>{formattedTitle}</Text>
        </View>
      </Touchable>
    );
  }
}

export default CustomButton;
