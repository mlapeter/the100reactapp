// @flow
import autobind from "autobind-decorator";
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

import {
  colors,
  fontSizes,
  fontStyles,
  styleSheet,
  StyleProps
} from "../../styles";

type Action = {
  onPress: () => mixed,
  onLongPress: () => mixed,
  icon: IconName,
  text?: string
};

type NavigationBarProps = StyleProps & {
  navigation: string,
  title: string,
  subtitle?: string,
  type: "opaque" | "transparent",
  titleStyle?: string,
  back?: string,
  rightAction?: Action,
  rightAction2?: Action,
  rightAction3?: Action,
  withGradient: boolean,
  expanded: boolean,
  largeTitle: boolean
};

export default class NavigationBar extends React.Component<NavigationBarProps> {
  static defaultProps = {
    type: "opaque",
    title: "",
    withGradient: false,
    expanded: false,
    color: "white"
  };

  @autobind
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render(): React.Node {
    const {
      type,
      title,
      subtitle,
      back,
      titleStyle,
      rightAction,
      rightAction2,
      rightAction3,
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
          {title !== "" && !expanded && (
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
              <TouchableOpacity
                onPress={rightAction.onPress}
                onLongPress={rightAction.onLongPress}
              >
                <View style={styles.rightAction}>
                  <Icon
                    name={rightAction.icon}
                    color={colors.white}
                    size={rightAction.size}
                  />
                  {rightAction.text && (
                    <Text
                      style={[
                        { color: colors.white },
                        styles.rightActionText,
                        styleSheet.typography["headline"]
                      ]}
                    >
                      {rightAction.text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {rightAction2 && (
              <TouchableOpacity
                onPress={rightAction2.onPress}
                onLongPress={rightAction2.onLongPress}
              >
                <View style={styles.rightAction}>
                  <Icon
                    name={rightAction2.icon}
                    color={colors.white}
                    size={rightAction2.size}
                  />
                  {rightAction2.text && (
                    <Text
                      style={[
                        { color: colors.white },
                        styles.rightActionText,
                        styleSheet.typography["headline"]
                      ]}
                    >
                      {rightAction2.text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {rightAction3 && (
              <TouchableOpacity
                onPress={rightAction3.onPress}
                onLongPress={rightAction3.onLongPress}
              >
                <View style={styles.rightAction}>
                  <Icon
                    name={rightAction3.icon}
                    color={colors.white}
                    size={rightAction3.size}
                  />
                  {rightAction3.text && (
                    <Text
                      style={[
                        { color: colors.white },
                        styles.rightActionText,
                        styleSheet.typography["headline"]
                      ]}
                    >
                      {rightAction3.text}
                    </Text>
                  )}
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
    justifyContent: "flex-end",
    alignItems: "center"
  },
  header: {
    padding: styleSheet.spacing.small
  },
  rightAction: {
    marginRight: styleSheet.spacing.small,
    flexDirection: "row"
  },
  rightActionText: {
    alignSelf: "center",
    marginLeft: styleSheet.spacing.tiny
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center"
  }
});

const AnimatedText = Animated.createAnimatedComponent(Text);
