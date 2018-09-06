import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";

import { setGammerTag, setGamertag } from "../../actions/onboarding";

import { colors, fontSizes, fontStyles } from "../../styles";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");
class CreateGamer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamertag: ""
    };
  }
  setGammerTag = () => {
    this.props.dispatch(setGamertag(this.state.gamertag));
    this.props.navigation.navigate("GamerProfile");
  };
  render() {
    const { platform } = this.props.onboarding;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={100}
        keyboardOpeningTime={10}
      >
        <Text style={styles.title}>Great!</Text>
        <Text style={styles.contentText}>
          What is your gamertag on{" "}
          <Text style={{ fontWeight: "bold" }}>{platform}?</Text>
        </Text>

        <View style={styles.gamerForm}>
          <Text style={styles.gamerLabel}>GAMERTAG</Text>
          <TextInput
            value={this.state.gamertag}
            onChangeText={text => this.setState({ gamertag: text })}
            autoFocus={true}
            style={styles.inputGamer}
            placeholderStyle={{ color: colors.grey }}
            underlineColorAndroid={"transparent"}
          />
        </View>
        {this.state.gamertag ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={this.setGammerTag}
          >
            <Text style={styles.btnText}>CONTINUE</Text>
          </TouchableOpacity>
        ) : null}
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
    backgroundColor: colors.veryDarkGrey,
    paddingTop: 40
  },
  title: {
    fontSize: fontSizes.h1,
    color: colors.white,
    opacity: colors.headlineOpacity,
    textAlign: "left"
  },
  contentText: {
    fontSize: fontSizes.secondary,
    color: colors.white,
    opacity: colors.primaryOpacity,
    paddingVertical: 15
  },
  gamerForm: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingVertical: 20,
    alignItems: "center"
  },
  continueBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  btnText: {
    color: colors.white
  },
  gamerLabel: {
    fontSize: fontSizes.secondary,
    color: colors.white,
    opacity: colors.headlineOpacity
  },
  inputGamer: {
    borderWidth: 1,
    borderColor: "#606060",
    color: colors.white,
    flex: 1,
    height: 40,
    marginLeft: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.darkGrey
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding
});
export default connect(mapStateToProps)(connectAlert(CreateGamer));
