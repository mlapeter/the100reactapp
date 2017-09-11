import React, { PropTypes } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes } from "../../styles";
Friend.propTypes = {
  user: PropTypes.object.isRequired
};

export default function Friend(props) {
  return (
    <View style={styles.container}>
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
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="gauge"
              size={14}
              color={colors.mediumGrey}
            />
            {props.user.light_level}

            <MaterialCommunityIcons
              name="star"
              size={14}
              color={colors.mediumGrey}
            />
            {props.user.karmas_count}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    margin: 1
  },
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
    padding: 5,
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
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});
