// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon, { type IconName } from "../Icon";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import {
  type NavigationNavigatorProps,
  type NavigationScreenProp
} from "react-navigation";

type Detail = {
  icon?: IconName,
  comp?: React.Node,
  link?: string,
  linkParams?: () => mixed,
  caption: string
};

type IconBarProps = {
  details: Detail[],
  navigation: NavigationScreenProp<{}>
};

export default class IconBar extends React.PureComponent<IconBarProps> {
  render(): React.Node {
    return (
      <View style={styles.details}>
        {this.props.details.map((detail, key) => (
          <View style={{ flex: 1 }} {...{ key }}>
            <TouchableOpacity
              onPress={
                detail.link
                  ? () => {
                      this.props.navigation.navigate(
                        detail.link,
                        detail.linkParams
                      );
                    }
                  : detail.action
                    ? detail.action
                    : null
              }
            >
              <View style={styles.item}>
                <View style={styles.icon}>
                  {detail.icon && <Icon name={detail.icon} primary />}
                  {detail.comp}
                </View>
                <Text style={[{ color: colors.primary }, styles.caption]}>
                  {detail.caption}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    flexDirection: "row",
    zIndex: 100,
    ...styleSheet.styles.shadow
  },
  item: {
    // flex: 1,
    alignItems: "center",
    padding: styleSheet.spacing.small
  },
  icon: {
    height: 30,
    justifyContent: "center"
  },
  caption: {
    marginTop: styleSheet.spacing.tiny
  }
});
