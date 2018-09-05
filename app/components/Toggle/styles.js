import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default (styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 30
  },
  icon: {
    marginVertical: 10,
    paddingBottom: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  iconText: {
    marginRight: 3,
    fontSize: fontSizes.h5,
    fontWeight: "bold"
  }
}));
