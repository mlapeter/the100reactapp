// @flow
import * as React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { LinearGradient } from "expo";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

import defaultGroupHeaderBackground from "../../assets/images/destiny-wallpaper-1.jpg";

type HeaderProps = {
  picture: Image,
  title?: string,
  children?: React.Node,
  heightRatio: number
};

export default class Header extends React.PureComponent<HeaderProps> {
  static defaultProps = {
    heightRatio: 0.68,
    title: undefined,
    children: undefined
  };

  render(): React.Node {
    const { picture, title, children, heightRatio } = this.props;
    return (
      <View style={{ height: width * heightRatio }}>
        <Image
          style={[{ height: width * heightRatio }, styles.image]}
          resizeMode="cover"
          source={
            picture === "img/default-group-header.jpg"
              ? defaultGroupHeaderBackground
              : { uri: picture }
          }
        />
        <LinearGradient
          style={styles.gradient}
          colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.4)"]}
        >
          {children}
          {title && (
            <Text style={[styles.text, styleSheet.typography["title2"]]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </View>
    );
  }
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: width
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between"
  },
  text: {
    padding: styleSheet.spacing.small,
    color: colors.white
  }
});
