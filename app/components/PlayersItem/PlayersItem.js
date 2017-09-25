import React, { PropTypes } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableHighlight
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fontSizes } from "../../styles";
import { StackNavigator } from "react-navigation";

PlayersItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default function PlayersItem(props) {
  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation.navigate("Player", {
          userId: props.user.id
        })}
      underlayColor="white"
    >
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
            <Text style={styles.gamertag}>{props.user.gamertag}</Text>
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
    </TouchableHighlight>
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
