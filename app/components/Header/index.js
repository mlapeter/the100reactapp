// @flow
import * as React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

import defaultUserHeaderBackground from "../../assets/images/d2-all.jpg";
import hunterHeader from "../../assets/images/d2-hunter.jpg";
import titanHeader from "../../assets/images/d2-titan.jpg";
import warlockHeader from "../../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../../assets/images/bungie-placeholder.jpg";
// import hunterHeader from "../../assets/images/nightstalker-hunter.jpg";
// import titanHeader from "../../assets/images/sunbreaker-titan.jpg";
// import warlockHeader from "../../assets/images/stormcaller-warlock.jpg";

type HeaderProps = {
  picture: Image,
  title?: string,
  children?: React.Node,
  heightRatio: number,
  topGradientTransparency: string,
  middleGradientTransparency: string,
  bottomGradientTransparency: string
};

export default class Header extends React.PureComponent<HeaderProps> {
  static defaultProps = {
    heightRatio: 0.68,
    topGradientTransparency: "rgba(0,0,0,0.4)",
    middleGradientTransparency: "rgba(0,0,0,0.0)",
    bottomGradientTransparency: "rgba(0,0,0,0.4)",
    title: undefined,
    children: undefined
  };

  computedPicture(picture: string) {
    console.log(picture);
    if (picture === "img/default-user-header.jpg") {
      return defaultUserHeaderBackground;
    } else if (picture === "img/default-group-header.jpg") {
      return defaultUserHeaderBackground;
    } else if (picture === "img/default-gaming-session-header.jpg") {
      return defaultGamingSessionHeaderBackground;
    } else if (picture === "img/hunter-header.jpg") {
      return hunterHeader;
    } else if (picture === "img/titan-header.jpg") {
      return titanHeader;
    } else if (picture === "img/warlock-header.jpg") {
      return warlockHeader;
    } else {
      return { uri: picture };
    }
  }

  render(): React.Node {
    const {
      picture,
      title,
      children,
      heightRatio,
      topGradientTransparency,
      middleGradientTransparency,
      bottomGradientTransparency
    } = this.props;
    const computedPicture = this.computedPicture(picture);

    return (
      <View style={{ height: width * heightRatio }}>
        <Image
          style={[{ height: width * heightRatio }, styles.image]}
          resizeMode="cover"
          source={computedPicture}
        />
        <LinearGradient
          style={styles.gradient}
          colors={[
            topGradientTransparency,
            middleGradientTransparency,
            bottomGradientTransparency
          ]}
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
