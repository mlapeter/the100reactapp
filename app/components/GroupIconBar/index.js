// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type GroupIconBarProps = {
  platform: string,
  users_count: string,
  play_style: string,
  play_schedule: string
};

export default class GroupIconBar extends React.PureComponent<
  GroupIconBarProps
> {
  render(): React.Node {
    const { platform, users_count, play_style, play_schedule } = this.props;

    return (
      <View style={styles.iconBar}>
        <PlatformIcon platform={platform} />
        <PlayerIcon usersCount={users_count} />
        <PlayStyleIcon play_style={play_style} />
        <PlayScheduleIcon playSchedule={play_schedule} />
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
  var schedule =
    props.playSchedule
      .split(" ")
      .slice(0, 2)
      .join(" ") + " UTC";

  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />
      <Text style={styles.icon}>{schedule}</Text>
    </Text>
  );
}

function PlayerIcon(props) {
  if (!props.usersCount) {
    return null;
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.usersCount}
    </Text>
  );
}

function PlayStyleIcon(props) {
  if (!props.play_style) {
    return null;
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons
        name="human-greeting"
        size={14}
        color={colors.grey}
      />
      <Text style={styles.icon}>{props.play_style}</Text>
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
