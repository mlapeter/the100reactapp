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
    padding: styleSheet.spacing.tiny,
    color: colors.black
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
  },
  card: {
    padding: 0
  },
  caption: {
    padding: styleSheet.spacing.tiny
  },
  image: {
    height: 200
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: styleSheet.spacing.tiny
  },
  comments: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginRight: styleSheet.spacing.tiny,
    flexDirection: "row"
  },
  iconButtonText: {
    alignSelf: "center"
  }
}));
