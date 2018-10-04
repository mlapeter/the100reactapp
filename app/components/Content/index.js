// @flow
import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";

import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import type { StyleProps } from "../../styles";

type ContentProps = {
  children: React.Node,
  style?: StyleProps
};

export default class Content extends React.PureComponent<ContentProps> {
  render(): React.Node {
    const { children, style } = this.props;
    return (
      <ScrollView style={styles.container} contentContainerStyle={style}>
        {children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray
  }
});
