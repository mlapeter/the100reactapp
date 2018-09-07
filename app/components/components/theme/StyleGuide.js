// @flow
import type {____ViewStyleProp_Internal as Style} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export type StyleProps = {
    style?: Style
};

export type Typography = {
    fontFamily: string,
    fontSize: number,
    lineHeight: number
};

export type Typographies = {
    body: Typography,
    callout: Typography,
    caption: Typography,
    footnote: Typography,
    headline: Typography,
    subhead: Typography,
    title1: Typography,
    title2: Typography,
    title3: Typography
};

export type Spacing = {
    tiny: number,
    small: number,
    base: number,
    large: number,
    xLarge: number
};

export type Palette = {
    black: string,
    darkGray: string,
    gray: string,
    lightGray: string,
    white: "white",
    transparent: "transparent"
};

export type Shadow = {
    shadowColor: string,
    shadowOffset: { width: number, height: number },
    shadowOpacity: number,
    shadowRadius: number,
    backgroundColor: "white"
};

export type Styles = {
    barHeight: {
        height: number
    },
    shadow: Shadow,
    borderRadius: {
        borderRadius: number
    },
    separator: {
        borderBottomWidth: number,
        borderColor: string
    },
    button: {
        height: number,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: number,
        marginBottom: number,
        borderRadius: number
    },
    buttonIcon: {
        marginRight: number
    }
};

export type StyleGuide = {
    palette: Palette,
    typography: Typographies,
    spacing: Spacing,
    styles: Styles
};

const darkGray = "#999999";
const gray = "#CCCCCC";
const tiny = 8;
const small = 16;
const borderRadius = tiny;
const shadow = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "white"
};

const styleGuide: StyleGuide = {
    palette: {
        black: "black",
        white: "white",
        transparent: "transparent",
        darkGray,
        gray,
        lightGray: "#F3F3F3"
    },
    typography: {
        body: {
            fontSize: 17,
            lineHeight: 20,
            fontFamily: "SFProText-Regular"
        },
        callout: {
            fontSize: 16,
            lineHeight: 20,
            fontFamily: "SFProText-Regular"
        },
        caption: {
            fontSize: 11,
            lineHeight: 13,
            fontFamily: "SFProText-Regular"
        },
        footnote: {
            fontSize: 13,
            lineHeight: 18,
            fontFamily: "SFProText-Regular",
            color: darkGray
        },
        headline: {
            fontSize: 17,
            lineHeight: 22,
            fontFamily: "SFProText-Semibold"
        },
        subhead: {
            fontSize: 15,
            lineHeight: 20,
            fontFamily: "SFProText-Regular"
        },
        title1: {
            fontSize: 34,
            lineHeight: 41,
            fontFamily: "SFProText-Bold"
        },
        title2: {
            fontSize: 28,
            lineHeight: 34,
            fontFamily: "SFProText-Bold"
        },
        title3: {
            fontSize: 22,
            lineHeight: 26,
            fontFamily: "SFProText-Bold"
        }
    },
    spacing: {
        tiny,
        small,
        base: 24,
        large: 48,
        xLarge: 64
    },
    styles: {
        barHeight: {
            height: 45
        },
        shadow,
        borderRadius: {
            borderRadius
        },
        separator: {
            borderBottomWidth: 1,
            borderColor: "#ebebeb"
        },
        button: {
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: small,
            padding: tiny,
            borderRadius
        },
        buttonIcon: {
            marginRight: tiny
        }
    }
};

export default styleGuide;
