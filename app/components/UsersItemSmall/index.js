import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableHighlight
} from "react-native";
import { StackNavigator } from "react-navigation";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes, fontStyles } from "../../styles";

export default function UsersItemSmall(props) {
  return (
    <TouchableHighlight onPress={() => props.onPress()} underlayColor="white">
      <View style={styles.profileBox}>
        <View style={styles.profileText}>
          <Text style={styles.gamertag}>{props.user}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  profileAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  profileBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 3,
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  profileText: {
    flexDirection: "column",
    paddingLeft: 5
  },
  gamertag: {
    fontFamily: fontStyles.primaryFont,
    paddingLeft: 5,
    fontSize: fontSizes.secondary
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingLeft: 3
  },
  icon: {
    padding: 2,
    margin: 2,
    fontSize: fontSizes.small,
    backgroundColor: colors.white,
    color: colors.mediumGrey
  }
});
