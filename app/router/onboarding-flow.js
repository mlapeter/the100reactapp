import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "react-navigation";

import ChoosePlatform from "../screens/onboarding/ChoosePlatform";
import CreateGamer from "../screens/onboarding/CreateGamer";
import ChooseGame from "../screens/onboarding/ChooseGame";
import GamerProfile from "../screens/onboarding/GamerProfile";
import CreateCredential from "../screens/onboarding/CreateCredential";

import { colors } from "../styles";

const styles = {
  headerStyle: {
    backgroundColor: colors.veryDarkGrey,
    height: 30,
  },
  headerTitleStyle: {
    color: colors.white,
    opacity: colors.headlineOpacity
  },
  backButtonStyle: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 5,
    backgroundColor: colors.darkGrey
  },
  backTitle: {
    color: colors.white
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
  ChooseGame: { screen: ChooseGame },
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
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});

ChooseGame.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <BackButton
      title="BACK"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
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
  headerStyle: styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle
});

export default OnboardingFlowStack;
