import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  KeyboardAvoidingView,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import Chat from "../components/Chat";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class HelpChat extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Chat url="chat/help_chatroom" room="help_chatroom" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  keyboardView: {
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.grey
  },
  container: {
    padding: 5,
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  }
});
