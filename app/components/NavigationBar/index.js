// @flow
import * as React from "react";
import {
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo";

import BackButton from "./BackButton";
import Icon from "../Icon";
import type { IconName } from "../Icon";

import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

type Action = {
  onPress: () => mixed,
  icon: IconName
};

type NavigationBarProps = {
  title: string,
  subtitle?: string,
  type: "opaque" | "transparent",
  titleStyle?: string,
  back?: string,
  rightAction?: Action,
  withGradient: boolean,
  expanded: boolean,
  largeTitle: boolean
};

export default class NavigationBar extends React.Component<NavigationBarProps> {
  static defaultProps = {
    type: "opaque",
    title: "",
    withGradient: false,
    expanded: false
  };

  goBack() {
    // this.props.navigation.goBack();
  }

  render(): React.Node {
    const {
      type,
      title,
      subtitle,
      back,
      titleStyle,
      rightAction,
      withGradient,
      expanded,
      largeTitle
    } = this.props;
    const block = { flex: largeTitle ? 2 : 1 };
    const containerStyle = {
      backgroundColor: type === "opaque" ? colors.primary : "transparent"
    };
    const navBar = (
      <SafeAreaView style={containerStyle}>
        <View style={styles.content}>
          <View style={[styles.leftBlock]}>
            {back && (
              <BackButton
                onPress={this.goBack}
                name="arrow-left"
                label={back}
              />
            )}
          </View>
          {title !== "" &&
            !expanded && (
              <View style={block}>
                <AnimatedText
                  color="white"
                  align="center"
                  style={[titleStyle, styleSheet.typography["headline"]]}
                  numberOfLines={1}
                >
                  {title}
                </AnimatedText>
                {subtitle && (
                  <Text
                    style={[styleSheet.typography["footnote"]]}
                    color="white"
                    align="center"
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}
          <View style={styles.rightBlock}>
            {rightAction && (
              <TouchableOpacity onPress={rightAction.onPress}>
                <View style={styles.rightAction}>
                  <Icon name={rightAction.icon} color={colors.white} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {expanded && (
          <View style={[{ backgroundColor: colors.primary }, styles.header]}>
            <Text
              style={[{ color: colors.white }, styleSheet.typography["title1"]]}
            >
              {title}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
    if (withGradient) {
      return (
        <LinearGradient colors={["black", "transparent"]}>
          {navBar}
        </LinearGradient>
      );
    }
    return navBar;
  }
}

const styles = StyleSheet.create({
  content: {
    ...styleSheet.styles.barHeight,
    flexDirection: "row",
    alignItems: "center"
  },
  leftBlock: {
    flex: 1
  },
  rightBlock: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  header: {
    padding: styleSheet.spacing.small
  },
  rightAction: {
    marginRight: styleSheet.spacing.small
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center"
  }
});

const AnimatedText = Animated.createAnimatedComponent(Text);
