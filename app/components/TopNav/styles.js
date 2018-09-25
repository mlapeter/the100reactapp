import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default (styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: colors.veryDarkGrey
  },
  title: {
    color: colors.white
  },

  menu: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "flex-start"
  },
  search: {
    flexDirection: "row",
    flex: 4,
    // marginLeft: 5,
    // marginRight: 5,
    // paddingVertical: 4,
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 0,
    backgroundColor: colors.veryDarkGrey
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: colors.searchbar
  },
  rightActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    padding: 5
  },
  add: {
    flex: 1,
    // marginHorizontal: 2,
    alignItems: "flex-start"
  },
  optionContainer: {
    paddingTop: 20,
    paddingBottom: 10
  },
  avatarMini: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    paddingLeft: 8
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontStyles.lato,
    fontSize: fontSizes.h5
  }
}));
