import EStylesheet from "react-native-extended-stylesheet";

export default EStylesheet.create({
  defaultText: {
    color: "$white"
  },
  container: {
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "$white"
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
    flexDirection: "row",
    margin: 5,
    padding: 5
  },
  input: {
    flexDirection: "row",
    alignItems: "stretch",
    margin: 5,
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da"
  },
  buttonWrapper: {
    padding: 10
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: "$white"
  },
  middleBox: {
    flex: 7,
    padding: 2,
    margin: 2,
    backgroundColor: "$white"
  },
  rightBox: {
    flex: 1.1
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  username: {
    color: "$grey",
    fontFamily: "$primaryFont"
    // fontSize: fontSizes.secondary
  },
  time: {
    padding: 3,
    color: "$lightestGrey"
    // fontSize: fontSizes.small
  },
  text: {
    color: "$mediumGrey"
  },
  iconText: {
    // fontSize: fontSizes.small,
    color: "$mediumGrey"
  }
});
