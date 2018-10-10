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
  avatarMini: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignSelf: "center"
  }
}));
