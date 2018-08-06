import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "react-navigation";

import ChoosePlatform from "../screens/onboarding/ChoosePlatform";
import CreateGamer from "../screens/onboarding/CreateGamer";
import GamerProfile from "../screens/onboarding/GamerProfile";
import CreateCredential from "../screens/onboarding/CreateCredential";

import { colors } from "../styles";

const styles = {
  headerStyle: {
    backgroundColor: colors.strongBlack,
    height: 80,
    paddingHorizontal: 20
  },
  headerTitleStyle: {
    color: "#fff"
  },
  backButtonStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#27282b"
  },
  backTitle: {
    color: "#fff"
  }
};
const BackButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButtonStyle}>
    <Text style={styles.backTitle}>{title}</Text>
  </TouchableOpacity>
);

const OnboardingFlowStack = createStackNavigator({
  ChoosePlatform: { screen: ChoosePlatform },
  CreateGamer: { screen: CreateGamer },
  GamerProfile: { screen: GamerProfile },
  CreateCredential: { screen: CreateCredential }
});

ChoosePlatform.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.navigate("AuthMainPage");
      }}
    />
  ),
  headerTitle: "SIGN UP",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});
CreateGamer.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  headerTitle: "SIGN UP",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});
GamerProfile.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  headerTitle: "SIGN UP",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});
CreateCredential.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  headerTitle: "SIGN UP",
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});

export default OnboardingFlowStack;
