import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { colors, fontSizes } from "../styles";

import Ionicon from "react-native-vector-icons/Ionicons";

export default class Menu extends React.Component {
  static navigationOptions = {
    drawerLabel: "Log Out!",
    drawerIcon: () => (
      <Ionicon name="md-search" size={24} color={colors.lightGrey} />
    )
  };

  render() {
    return (
      <View>
        <Text>Section 1</Text>
        <View>
          <Text>Page1</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  }
});
