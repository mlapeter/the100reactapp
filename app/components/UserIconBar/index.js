// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type UserIconBarProps = {
  platform: string,
  karmasCount: string,
  lightLevel: string,
  playSchedule: string
};

export default class UserIconBar extends React.PureComponent<UserIconBarProps> {
  render(): React.Node {
    const { platform, lightLevel, karmasCount, playSchedule } = this.props;

    return (
      <View style={styles.iconBar}>
        <PlatformIcon platform={platform} />
        <PowerIcon lightLevel={lightLevel} />
        <KarmaIcon karmasCount={karmasCount} />
        <PlayScheduleIcon playSchedule={playSchedule} />
      </View>
    );
  }
}

function PlatformIcon(props) {
  if (!props.platform) {
    return null;
  }
  if (props.platform === "ps4") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="playstation"
          size={14}
          color={colors.grey}
        />
        PS4
      </Text>
    );
  } else if (props.platform === "xbox-one") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="xbox" size={14} color={colors.grey} />
        XBOX
      </Text>
    );
  } else {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="microsoft"
          size={14}
          color={colors.grey}
        />
        PC
      </Text>
    );
  }
}

function PlayScheduleIcon(props) {
  if (!props.playSchedule) {
    return null;
  }
  var schedule = props.playSchedule
    .split(" ")
    .slice(0, 2)
    .join(" ");

  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />
      <Text style={styles.icon}>{schedule}</Text>
    </Text>
  );
}

function PowerIcon(props) {
  if (!props.lightLevel) {
    return null;
  }
  if (props.lightLevel) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
        {props.lightLevel}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
      Any
    </Text>
  );
}

function KarmaIcon(props) {
  if (!props.karmasCount) {
    return null;
  }
  if (props.karmasCount) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="star" size={14} color={colors.grey} />
        {props.karmasCount}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="star" size={14} color={colors.grey} />
      New!
    </Text>
  );
}

const styles = StyleSheet.create({
  iconBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  icon: {
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  }
});
