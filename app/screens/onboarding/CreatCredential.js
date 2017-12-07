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
import { setCredential } from "../../actions/onboarding";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "react-native-check-box";

import { colors, fontSizes, fontStyles } from "../../styles";

const { width, height } = Dimensions.get("window");
class CreateCredential extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      sendNotification: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.authenticationError
      // && nextProps.authenticationError !== this.props.authenticationError
    ) {
      this.props.alertWithType("error", "Error", nextProps.authenticationError);
    }
  }
  sendUserInfo = () => {
    this.props.dispatch(setCredential(this.state.email, this.state.password, this.state.sendNotification))
  }
  render() {
    if (nextProps.authentication.isAuthed === true) {
      this.props.navigation.navigate("Main");
    }
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={100}
        keyboardOpeningTime={10}
      >
        <Text style={styles.title}>One last thing...</Text>
        <Text style={styles.contentText}>
          You will need to create a password for logging in, and we will need your email for sending you notifications when you have a game scheduled as well as password reset.
        </Text>
        <View style={styles.inputForm}>
          <View style={styles.inputRow}>
            <Text style={styles.gamerLabel}>EMAIL</Text>
            <TextInput
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text})}
              placeholder="INPUT EMAIL"
              style={styles.inputGamer}
              placeholderStyle={{color: '#606060'}}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.gamerLabel}>PASSWORD</Text>
            <TextInput
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text})}
              placeholder="PASSWORD"
              style={styles.inputGamer}
              placeholderStyle={{color: '#606060'}}
              secureTextEntry
            />
          </View>
          <CheckBox
            checkBoxColor="#949599"
            rightText="Send notifications about my group"
            rightTextStyle={styles.contentText}
            isChecked={this.state.sendNotification}
            onClick={(val) => this.setState({ sendNotification: val})}
          />
        </View>
        { this.state.email && this.state.password ? <TouchableOpacity
          style={styles.continueBtn}
          onPress={this.sendUserInfo}
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
  inputForm: {
    alignSelf: 'stretch'
  },
  inputRow: {
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
    flex: 1,
    fontSize: fontSizes.secondary,
    color: colors.onboardingText,
  },
  inputGamer: {
    flex: 3,
    borderWidth: 1,
    borderColor: "#606060",
    color: "#9fa0a4",
    flex: 1,
    height: 40,
    marginLeft: 20,
    paddingHorizontal: 20,
    backgroundColor: '#27292d'
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding,
  authentication: state.authentication,
  authenticationError: state.authentication.error
})
export default connect(mapStateToProps)(connectAlert(CreateCredential));