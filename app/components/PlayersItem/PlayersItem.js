import React from "react";
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
import { StackNavigator } from "react-navigation";

PlayersItem.propTypes = {
  user: PropTypes.object.isRequired
};

function PlatformId(props) {
  if (props.platform == "xbox-one" && props.user.xbox_live_id) {
    return props.user.xbox_live_id;
  } else if (props.platform == "ps4" && props.user.psn_id) {
    return props.user.psn_id;
  } else if (props.platform == "pc" && props.user.xbox_windows_id) {
    return props.user.xbox_windows_id;
  } else if (props.platform == "steam" && props.user.steam_id) {
    return props.user.steam_id;
  } else if (props.platform == "battle-net" && props.user.battle_net_id) {
    return props.user.battle_net_id;
  } else if (props.platform == "uplay" && props.user.uplay_id) {
    return props.user.uplay_id;
  } else {
    return props.user.gamertag;
  }
}

export default function PlayersItem(props) {
  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation.navigate({
          routeName: "Player",
          params: {
            userId: props.user.id
          },
          key: "user-" + props.user.id
        })
      }
      underlayColor="white"
    >
      <View style={styles.container}>
        <View style={styles.profileBox}>
          <Image
            style={styles.profileAvatar}
            source={
              props.user.computed_avatar_api === "img/default-avatar.png"
                ? require("../../assets/images/default-avatar.png")
                : { uri: props.user.computed_avatar_api }
            }
          />

          <View style={styles.profileText}>
            <Text style={styles.gamertag}>{PlatformId(props)}</Text>
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
            <Text style={styles.iconText}>
              {props.reserve === true ? " RESERVE " : null}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 5,
    margin: 1,
    flex: 1
  },
  profileAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  profileBox: {
    padding: 1,
    flexDirection: "row",
    minWidth: 150,
    flex: 1
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
  iconText: {
    fontSize: fontSizes.small,
    paddingLeft: 5,
    color: colors.mediumGrey
  }
});
