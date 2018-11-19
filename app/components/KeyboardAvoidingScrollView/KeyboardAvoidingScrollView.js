import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Keyboard,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./styles";

class KeyboardAvoidingScrollView extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    if (Platform.OS === "ios") {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          {this.props.children}
        </KeyboardAwareScrollView>
      );
    } else {
      return (
        <KeyboardAvoidingView
          contentContainerStyle={styles.scrollContainer}
          keyboardVerticalOffset={100}
        >
          <ScrollView keyboardShouldPersistTaps="always">
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
              style={styles.touchableContainer}
            >
              <View style={styles.touchableView}>{this.props.children}</View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
  }
}

export default KeyboardAvoidingScrollView;
