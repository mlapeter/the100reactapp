import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

export default (styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: styleSheet.spacing.tiny
  },
  text: {
    padding: styleSheet.spacing.tiny
  },
  user: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  username: {
    justifyContent: "space-between",
    marginLeft: styleSheet.spacing.tiny
  },
  headline: {
    lineHeight: 17
  },
  footnote: {
    lineHeight: 13
  },
  avatarMini: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignSelf: "center"
  }

  // defaultText: {
  //   color: colors.white
  // },
  // container: {
  //   padding: 5,
  //   margin: 3,
  //   flex: 1,
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   backgroundColor: colors.white
  // },
  // loading: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   margin: 10
  // },
  // box: {
  //   flexDirection: "row",
  //   margin: 5,
  //   padding: 5
  // },
  // input: {
  //   flexDirection: "row",
  //   alignItems: "stretch",
  //   margin: 5,
  //   padding: 5,
  //   borderTopWidth: 0.5,
  //   borderTopColor: "#d6d7da"
  // },
  // buttonWrapper: {
  //   padding: 10
  // },
  // leftBox: {
  //   flex: 1,
  //   padding: 2,
  //   margin: 2,
  //   backgroundColor: colors.white
  // },
  // middleBox: {
  //   flex: 7,
  //   padding: 2,
  //   margin: 2,
  //   backgroundColor: colors.white
  // },
  // rightBox: {
  //   flex: 1.1
  // },
  // avatarMini: {
  //   height: 36,
  //   width: 36,
  //   borderRadius: 18,
  //   alignSelf: "center"
  // },
  // message: {
  //   color: colors.grey,
  //   fontFamily: fontStyles.lato,
  //   fontSize: fontSizes.secondary
  // },
  // time: {
  //   padding: 3,
  //   color: colors.lightestGrey,
  //   fontSize: fontSizes.small
  // },
  // text: {
  //   color: colors.mediumGrey
  // },
  // iconText: {
  //   fontSize: fontSizes.small,
  //   color: colors.mediumGrey
  // }
}));
