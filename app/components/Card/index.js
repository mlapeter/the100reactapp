// @flow
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

type CardProps = {
  onPress?: () => mixed,
  children: React.Node
};

export default class Card extends React.PureComponent<CardProps> {
  render(): React.Node {
    const { style, onPress, children } = this.props;
    return (
      <TouchableOpacity {...{ onPress }}>
        <View style={[styles.card, style]}>{children}</View>
      </TouchableOpacity>
    );
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
