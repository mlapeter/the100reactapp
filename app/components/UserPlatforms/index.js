// @flow
import * as React from "react";
import {
  Alert,
  Clipboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connectAlert } from "../Alert";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "../Icon";
import type { IconName } from "../Icon";

type UserPlatformsProps = {
  icon: IconName,
  xbox_live_id?: string,
  psn_id?: string,
  xbox_windows_id?: string,
  steam_id?: string,
  battle_net_id?: string,
  uplay_id?: string
};

export default class UserPlatforms extends React.Component<UserPlatformsProps> {
  render(): React.Node {
    const {
      xbox_live_id,
      psn_id,
      xbox_windows_id,
      steam_id,
      battle_net_id,
      uplay_id
    } = this.props;

    copyToClipboard = (text: string) => {
      Clipboard.setString(text);
      Alert.alert("Gamer ID copied to clipboard!");
    };

    return (
      <View style={styles.iconBar}>
        <XboxLiveIcon xbox_live_id={xbox_live_id} />
        <PsnIcon psn_id={psn_id} />
        <XboxPcIcon xbox_windows_id={xbox_windows_id} />
        <SteamIcon steam_id={steam_id} />
        <BnetIcon battle_net_id={battle_net_id} />
        <UplayIcon uplay_id={uplay_id} />
      </View>
    );
  }
}

function XboxLiveIcon(props) {
  console.log("props.xbox_live_id: ", props.xbox_live_id);
  if (props.xbox_live_id == null) {
    return null;
  }

  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.xbox_live_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="xbox"
          size={14}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.xbox_live_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PsnIcon(props) {
  if (props.psn_id == null) {
    return null;
  }
  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.psn_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="playstation"
          size={14}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.psn_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function XboxPcIcon(props) {
  if (props.xbox_windows_id == null) {
    return null;
  }
  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.xbox_windows_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="microsoft"
          size={14}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.xbox_windows_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function SteamIcon(props) {
  if (props.steam_id == null) {
    return null;
  }
  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.steam_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="steam"
          size={14}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.steam_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function BnetIcon(props) {
  if (props.battle_net_id == null) {
    return null;
  }
  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.battle_net_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <Icon
          name="battlenet"
          size={16}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.battle_net_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function UplayIcon(props) {
  if (props.uplay_id == null) {
    return null;
  }
  return (
    <TouchableOpacity
      onLongPress={() => this.copyToClipboard(props.uplay_id)}
      activeOpacity={0.6}
    >
      <View style={styles.iconWrapper}>
        <Icon
          name="ubisoft"
          size={16}
          color={colors.grey}
          style={styles.icon}
        />
        <Text>{props.uplay_id}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBar: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch"
  },
  iconWrapper: {
    flex: 1,
    flexDirection: "row",
    margin: 3,
    padding: 2,
    alignContent: "center",
    justifyContent: "center"
  },
  icon: {
    marginRight: 2
  }
});
