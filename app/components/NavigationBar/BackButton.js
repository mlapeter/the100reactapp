// @flow
import * as React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

import Icon, { type IconName } from "../Icon";

type LeftActionProps = {
  name: IconName,
  label: string,
  onPress: () => void
};

export default class LeftAction extends React.PureComponent<LeftActionProps> {
  render(): React.Node {
    const { name, label, onPress } = this.props;
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="transparent"
        {...{ onPress }}
      >
        <View style={styles.backBtn}>
          <Icon color="white" {...{ name }} />
          <Text style={{ color: colors.white }}>{label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center"
  }
});
