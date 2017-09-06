import React, { PropTypes } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes } from "../../styles";
Player.propTypes = {
  user: PropTypes.object.isRequired
};

export default function Player(props) {
  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Image
          style={styles.profileAvatar}
          source={{
            uri: props.user.computed_avatar_api
          }}
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
    padding: 1,
    flexDirection: "row",
    width: 160
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
