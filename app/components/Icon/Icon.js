// @flow
import * as React from "react";
import { Font } from "expo";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";

import icoMoonConfig from "./config.json";
import icoMoonConfig2 from "./selection.json";
import icoMoonConfigPlatforms from "./selectionPlatforms.json";

import Icons from "./icons.ttf";
import CustomIcons from "./icomoon.ttf";
import PlatformIcons from "./icomoonPlatforms.ttf";

import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

const Icon = createIconSetFromIcoMoon(icoMoonConfig, "Icons");
const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig2, "CustomIcons");
const PlatformIcon = createIconSetFromIcoMoon(
  icoMoonConfigPlatforms,
  "PlatformIcons"
);

import Ionicons from "react-native-vector-icons/Ionicons";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export type IconName = "arrow-left" | "share" | "battlenet" | "ubisoft";

const customIcons = ["outline-person_add-24px"];

const platformIcons = ["battlenet", "ubisoft"];

const materialIcons = [
  "person-add",
  "star",
  "star-border",
  "chat-bubble-outline",
  "cancel",
  "edit",
  "more-horiz"
];

const icons = ["arrow-left", "share"];

type IconProps = {
  name: IconName,
  primary?: boolean,
  secondary?: boolean,
  color: string,
  size?: number
};

export const loadIcons = () => Font.loadAsync({ Icons });
export const loadCustomIcons = () => Font.loadAsync({ CustomIcons });
export const loadPlatformIcons = () => Font.loadAsync({ PlatformIcons });

class IconComp extends React.PureComponent<IconProps> {
  static defaultProps = {
    color: colors.darkGray,
    size: 28
  };

  render(): React.Node {
    const { name, primary, secondary, color, size } = this.props;
    let iconColor: string;
    if (primary) {
      iconColor = colors.primary;
    } else if (secondary) {
      iconColor = colors.secondary;
    } else {
      iconColor = color;
    }
    if (icons.includes(name)) {
      return <Icon color={iconColor} {...{ name, size }} />;
    } else if (customIcons.includes(name)) {
      return <CustomIcon color={iconColor} {...{ name, size }} />;
    } else if (platformIcons.includes(name)) {
      return <PlatformIcon color={iconColor} {...{ name, size }} />;
    } else if (materialIcons.includes(name)) {
      return <MaterialIcons color={iconColor} name={name} size={size} />;
    } else {
      return <Ionicons color={iconColor} name={name} size={size} />;
    }
  }
}

export default IconComp;
