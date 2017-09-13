import React, { Component, PropTypes } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableHighlight
} from "react-native";
import { StackNavigator } from "react-navigation";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes } from "../../styles";
Friend.propTypes = {
  user: PropTypes.object.isRequired
};

export default function Friend(props) {
  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation.navigate("User", {
          userId: props.user.id
        })}
      underlayColor="white"
    >
      <View style={styles.profileBox}>
        <Image
          style={styles.profileAvatar}
          source={
            props.user.computed_avatar_api === "img/default-avatar.png"
              ? require("../../images/default-avatar.png")
              : { uri: props.user.computed_avatar_api }
          }
        />
        <View style={styles.profileText}>
          <Text style={styles.gamertag}>
            {props.user.gamertag}
          </Text>
          <View style={styles.iconBar}>
            <LevelIcon lightLevel={props.user.light_level} />
            <KarmaIcon karmasCount={props.user.karmas_count} />
            <ProfanityIcon profanityOk={props.user.profanity_ok} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

function LevelIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
      {props.lightLevel}
    </Text>
  );
}

function KarmaIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="star" size={14} color={colors.grey} />
      {props.karmasCount}
    </Text>
  );
}

function ProfanityIcon(props) {
  if (props.profanityOk === "no") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="security" size={14} color={colors.grey} />
        No Profanity
      </Text>
    );
  }
  return null;
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
    margin: 5,
    marginBottom: 5,
    padding: 5,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  profileText: {
    flexDirection: "column",
    paddingLeft: 5
  },
  gamertag: {
    fontFamily: "Futura",
    paddingLeft: 5,
    fontSize: fontSizes.secondary
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5
  },
  icon: {
    padding: 2,
    margin: 2,
    fontSize: fontSizes.small,
    backgroundColor: colors.white,
    color: colors.mediumGrey
  }
});
