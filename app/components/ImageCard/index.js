// @flow
import * as React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { LinearGradient } from "expo";

import {
  colors,
  fontSizes,
  fontStyles,
  styleSheet,
  StyleProps
} from "../../styles";

type ImageCardProps = StyleProps & {
  title: string,
  subtitle?: string,
  description?: string,
  picture?: React.Node | { uri: string },
  height?: number,
  onPress: () => mixed,
  children?: React.Node
};

export default class ImageCard extends React.PureComponent<ImageCardProps> {
  static defaultProps = {
    heightRatio: 0.68,
    height: 300
  };

  render(): React.Node {
    const {
      picture,
      height,
      heightRatio,
      title,
      subtitle,
      description,
      onPress,
      children,
      style
    } = this.props;
    return (
      <TouchableWithoutFeedback {...{ onPress }}>
        <View style={[{ height: width * heightRatio }, styles.card, style]}>
          {picture && (
            <Image
              resizeMode="cover"
              style={[
                styles.image,
                {
                  width: width - 2 * styleSheet.spacing.small,
                  height: (width - 2 * styleSheet.spacing.small) * heightRatio
                }
              ]}
              source={picture}
            />
          )}
          {children}
          <View style={styles.content}>
            <LinearGradient colors={topGradient} style={styles.gradient}>
              {subtitle && (
                <Text
                  style={[styles.subtitle, styleSheet.typography["headline"]]}
                >
                  {subtitle.toUpperCase()}
                </Text>
              )}
              <Text
                style={[
                  { color: colors.white },
                  styleSheet.typography["title2"]
                ]}
              >
                {title}
              </Text>
            </LinearGradient>
            {description && (
              <LinearGradient colors={bottomGradient} style={styles.gradient}>
                {typeof description === "string" && (
                  <Text style={{ color: colors.white }}>{description}</Text>
                )}
                // {typeof description !== "string" && description}
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const topGradient = ["rgba(0,0,0,0.7)", "transparent"];
const bottomGradient = ["transparent", "rgba(0,0,0,0.8)"];
const subtitle = "rgba(255, 255, 255, 0.7)";
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    ...styleSheet.styles.borderRadius,
    ...styleSheet.styles.shadow,
    marginTop: styleSheet.spacing.small,
    marginHorizontal: styleSheet.spacing.small,
    backgroundColor: colors.darkGray,
    flex: 1
    // overflow: "hidden"
  },
  image: {
    ...styleSheet.styles.borderRadius,
    flex: 1
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between"
  },
  gradient: {
    padding: styleSheet.spacing.small,
    ...styleSheet.styles.borderRadius
  },
  subtitle: {
    color: subtitle,
    fontSize: 15
  }
});
