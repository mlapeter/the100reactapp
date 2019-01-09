// @flow
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import type { StyleProps } from "../../styles";

type CardProps = {
  onPress?: () => mixed,
  children: React.Node,
  style?: StyleProps
};

export default class Card extends React.PureComponent<CardProps> {
  render(): React.Node {
    const { style, onPress, children } = this.props;
    if (onPress) {
      return (
        <TouchableOpacity {...{ onPress }}>
          <View style={[styles.card, style]}>{children}</View>
        </TouchableOpacity>
      );
    } else {
      return <View style={[styles.card, style]}>{children}</View>;
    }
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: styleSheet.spacing.tiny,
    marginHorizontal: styleSheet.spacing.small,
    marginTop: styleSheet.spacing.small,
    marginBottom: 1,
    ...styleSheet.styles.borderRadius,
    ...styleSheet.styles.shadow
  }
});
