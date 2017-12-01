import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";

import { colors, fontSizes, fontStyles } from "../../styles";

import ICPlaystation from "../../assets/images/ic-playstation.png";
import ICSbox from "../../assets/images/ic-sbox.png";
import ICWindows from "../../assets/images/ic-windows.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");
class ChooseGamer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      gamertag: ""
    }
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={100}
        keyboardOpeningTime={10}
      >
        <Text style={styles.title}>Great!</Text>
        <Text style={styles.contentText}>
          What is you gamertag in <Text style={{fontWeight: "bold"}}>{params.platform}</Text>
        </Text>
        <Text style={styles.contentText}>
          Your gamertag will be used in your gamertag.
        </Text>
        <View style={styles.gamerForm}>
          <Text style={styles.gamerLabel}>GAMERTAG</Text>
          <TextInput
            value={this.state.gamertag}
            onChangeText={(text) => this.setState({ gamertag: text})}
            placeholder="Enter your tag"
            style={styles.inputGamer}
            placeholderStyle={{color: '#525458'}}
          />
        </View>
        { this.state.gamertag ? <TouchableOpacity
          style={styles.continueBtn}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
        </TouchableOpacity>: null}
      </KeyboardAwareScrollView>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: colors.strongBlack,
    paddingTop: 40
  },
  title: {
    fontSize: fontSizes.h1,
    color: colors.onboardingTitle,
    textAlign: "left"
  },
  contentText: {
    fontSize: fontSizes.secondary,
    color: colors.onboardingText,
    paddingVertical: 15
  },
  gamerForm: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingVertical: 20,
    alignItems: 'center'
  },
  continueBtn: {
    backgroundColor: "#6ba1fc",
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  btnText: {
    color: "#fff"
  },
  gamerLabel: {
    fontSize: fontSizes.secondary,
    color: colors.onboardingText,
  },
  inputGamer: {
    borderWidth: 1,
    borderColor: "#27292d",
    color: "#9fa0a4",
    flex: 1,
    height: 40,
    marginLeft: 20,
    paddingHorizontal: 20,
    backgroundColor: '#27292d'
  }
};
export default ChooseGamer;