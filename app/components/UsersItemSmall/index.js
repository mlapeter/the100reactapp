import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableHighlight
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes, fontStyles } from "../../styles";

export default function UsersItemSmall(props) {
  return (
    <TouchableHighlight onPress={() => props.onPress()} underlayColor="white">
      <View style={styles.profileBox}>
        <Image
          style={styles.profileAvatar}
          source={
            props.usernameAvatars[props.user] === undefined ||
            props.usernameAvatars[props.user] === "img/default-avatar.png"
              ? require("../../assets/images/default-avatar.jpg")
              : { uri: props.usernameAvatars[props.user] }
          }
        />
        <View style={styles.profileText}>
          <Text style={styles.gamertag}>{props.user}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  profileAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10
  },
  profileBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10,
    borderTopWidth: 0.3,
    borderTopColor: colors.veryLightestGrey,
    backgroundColor: colors.white
  },
  profileText: {
    flexDirection: "column",
    paddingLeft: 5
  },
  gamertag: {
    fontFamily: fontStyles.alternateFont,
    paddingLeft: 5,
    fontSize: fontSizes.secondary,
    color: colors.mediumGrey
  }
});
