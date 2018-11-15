import EStyleSheet from "react-native-extended-stylesheet";
import { colors, fontSizes, fontStyles } from "../../styles";

export default EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "$bgColor",
    paddingHorizontal: 5,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: colors.veryDarkGrey
  }
});
