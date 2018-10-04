import type { StyleObj } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export type StyleProps = {
  style?: StyleObj
};

export const colors = {
  blue: "#4A90E2",
  red: "#FF6A60",
  primary: "#4E595D",
  secondary: "#929292",
  active: "#4A90E2",
  border: "#E4E4E4",
  tabPrimary: "#F7F9F9",
  primaryBlue: "#4A90E2",
  white: "#fff",
  grey: "#43454a",
  veryDarkGrey: "#23272A",
  darkGrey: "#2C2F33",
  mediumGrey: "rgba(79,84,92,.9)",
  lightGrey: "#737f8d",
  lightestGrey: "#99aab5",
  veryLightestGrey: "#d6d7da",
  searchbar: "#ededed",
  // dlight: #36393f
  // primaryBlue: "#5a8cf0",

  /** Dark theme */
  strongBlack: "#18191b",
  // onboardingTitle: "#fff",
  // onboardingText: "#fff",
  // onboardingTitle: "#9ea0a9",
  // onboardingText: "#575a5f"
  headlineOpacity: 0.95,
  primaryOpacity: 0.85,
  secondaryOpacity: 0.7,
  hintOpacity: 0.5,
  dividerOpacity: 0.12,
  //New
  black: "black",
  white: "white",
  transparent: "transparent",
  darkGray,
  gray,
  lightGray: "#F3F3F3"
};

export const fontSizes = {
  h1: 36,
  h2: 30,
  h3: 26,
  h4: 20,
  h5: 16,
  h6: 12,
  primary: 20,
  secondary: 15,
  small: 12
};

export const fontStyles = {
  primaryFont: "Nunito",
  gameHeaderFont: "Lato",
  nunito: "Nunito",
  lato: "Lato",
  alternateFont: "Helvetica Neue"
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

export const styleSheet = {
  typography: {
    summary: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: "SFProText-Regular"
    },
    body: {
      fontSize: 15,
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
    headline2: {
      fontSize: 16,
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
