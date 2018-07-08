import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default (styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6
  },

  menu: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "flex-start"
  },
  search: {
    flexDirection: "row",
    flex: 10,
    marginLeft: 25,
    marginRight: 10,
    paddingVertical: 4,
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: colors.white
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    padding: 5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: colors.searchbar
  },
  add: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center"
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
    padding: 5
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontStyles.lato,
    fontSize: fontSizes.h5
  }
}));
