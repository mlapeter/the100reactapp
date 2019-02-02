// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Moment from "../../../node_modules/react-moment";
Moment.globalLocale = "en";

type GamingSessionIconBarProps = {
  startTime: string,
  platform: string,
  primaryUsersCount: string,
  teamSize: string,
  lightLevel: string,
  sherpaLed?: string
};

export default class GamingSessionIconBar extends React.PureComponent<GamingSessionIconBarProps> {
  render(): React.Node {
    const {
      startTime,
      platform,
      primaryUsersCount,
      teamSize,
      lightLevel,
      sherpaLed,
      style
    } = this.props;

    return (
      <View style={[styles.iconBar, style]}>
        {startTime && <TimeIcon startTime={startTime} />}
        {platform && <PlatformIcon platform={platform} />}
        {primaryUsersCount && (
          <PlayerIcon
            primaryUsersCount={primaryUsersCount}
            teamSize={teamSize}
          />
        )}
        {lightLevel && <PowerIcon lightLevel={lightLevel} />}
        {sherpaLed && <SherpaIcon sherpaLed={sherpaLed} />}
      </View>
    );
  }
}

function PlatformIcon(props) {
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

function TimeIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />

      <Moment format="hh:mm A  MM/DD/YY" element={Text}>
        {props.startTime.toString()}
      </Moment>
    </Text>
  );
}

function PlayerIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.primaryUsersCount}/{props.teamSize}
    </Text>
  );
}

function PowerIcon(props) {
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

function SherpaIcon(props) {
  if (props.sherpaLed) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="security" size={14} color={colors.grey} />
        Sherpa-Led
      </Text>
    );
  }
  return null;
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
