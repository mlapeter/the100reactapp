import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default (styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 30
  },
  buttonText: {
    fontSize: 12,
    fontFamily: "SFProText-Bold",
    textTransform: "uppercase",
    color: "white",
    alignSelf: "center",
  },
  buttonTextToggle: {
    fontSize: 12,
    fontFamily: "SFProText-Bold",
    textTransform: "uppercase",
    color: colors.blue,
    alignSelf: "center"
  },

  buttonTextToggleSupporter: {
    fontSize: 12,
    fontFamily: "SFProText-Bold",
    textTransform: "uppercase",
    color: colors.gold,
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: colors.blue,
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 5,
    marginHorizontal: 3,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingVertical: 5,
  },
  buttonToggle: {
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 5,
    marginHorizontal: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  buttonToggleSupporter: {
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 5,
    marginHorizontal: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },


  buttonToggleBar: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 15,
    flex: 1
  },
  helpMessage: {
    marginVertical: 10,
  },
  errorMessage: {
    marginVertical: 10,
    color: colors.red
  },
  scrollContainer: {
    // backgroundColor: colors.white
  },
  outerContainer: {
    flex: 1
    // backgroundColor: colors.white
  },

  container: {
    flex: 1,
    marginTop: 5,
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  buttonWrapper: {
    padding: 10
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
  },
  formGroup: {
    marginVertical: 15,
  },

  inputSelect: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    // backgroundColor: "#eee",
    alignItems: "center"
  },
  input: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    // backgroundColor: "#eee",
    alignItems: "center"
  },
  inputText: {
    flex: 5,
    height: 40
  },





}));
