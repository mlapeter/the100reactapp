// @flow
import * as React from "react";
import {Font} from "expo";
import {createIconSetFromIcoMoon} from "@expo/vector-icons";

import icoMoonConfig from "./config.json";

import {StyleGuide, withTheme} from "../theme";

import type {ThemeProps} from "../theme";

import Icons from "./icons.ttf";

const Icon = createIconSetFromIcoMoon(icoMoonConfig, "Icons");

export type IconName = "arrow-up" | "arrow-right" | "arrow-left" | "arrow-down" | "circle-empty" | "tick" | "shuffle" |
"repeat" | "previous" | "next" | "pause" | "write" | "account" | "albums" | "photos" | "message" | "feed" |
 "music" | "hotel" | "time" | "restaurant" | "map" | "climate" | "cities" | "money" | "crop" | "flash" | "grid" |
 "filters" | "reverse" | "camera" | "heart" | "search" | "sign-out" | "share" | "options" | "play" | "bookmark" |
 "cross" | "minus" | "plus" | "send" | "circle";

type IconProps = ThemeProps & {
    name: IconName,
    primary?: boolean,
    secondary?: boolean,
    color: string,
    size: number
};

export const loadIcons = () => Font.loadAsync({ Icons });

class IconComp extends React.PureComponent<IconProps> {

    static defaultProps = {
        color: StyleGuide.palette.darkGray,
        size: 28
    };

    render(): React.Node {
        const {theme, name, primary, secondary, color, size} = this.props;
        let iconColor: string;
        if (primary) {
            iconColor = theme.palette.primary;
        } else if (secondary) {
            iconColor = theme.palette.secondary;
        } else {
            iconColor = color;
        }
        return (
            <Icon color={iconColor} {...{name, size}} />
        );
    }
}

export default withTheme(IconComp);
