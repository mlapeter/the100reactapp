import { StyleSheet } from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default (styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: colors.blue,
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingVertical: 5,
    marginBottom: 15
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
  }
}));
