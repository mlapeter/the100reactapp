import EStyleSheet from "react-native-extended-stylesheet";
import { colors, fontSizes, fontStyles } from "../../styles";

export default EStyleSheet.create({
  keyboardAvoidingContainer: {
    backgroundColor: colors.darkGrey,
    alignSelf: "stretch"
  },
  containerAvoiding: {
    alignSelf: "stretch",
    backgroundColor: colors.darkGrey
  },
  scrollContainer: {
    alignItems: "center",
    backgroundColor: colors.darkGrey
  },
  touchableContainer: {
    backgroundColor: colors.darkGrey
  },
  touchableView: {
    alignItems: "center",
    alignSelf: "stretch",
    height: "100%",
    backgroundColor: colors.darkGrey
  }
});
