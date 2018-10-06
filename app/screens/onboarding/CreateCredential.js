import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { createUser } from "../../actions/onboarding";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "react-native-check-box";

import { colors, fontSizes, fontStyles } from "../../styles";

const { width, height } = Dimensions.get("window");

class CreateCredential extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      tos_privacy_agreement: true,
      loading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.onboarding.error &&
      nextProps.onboarding.errorAt !== this.props.onboarding.errorAt
    ) {
      this.props.alertWithType("error", "Error", nextProps.onboarding.error);
    }
    if (
      nextProps.users.currentUser
      //  &&
      // nextProps.users.successAt !== this.props.users.successAt
    ) {
      this.props.alertWithType("success", "Success", "Account Created!");
      this.props.navigation.navigate("App");
    }
    // if (nextProps.authentication.isAuthed) {
    //   this.props.navigation.navigate("App");
    // }
  }
  sendUserInfo = () => {
    console.log("submitting user info");
    console.log(this.state);
    this.setState({ loading: true });
    this.props.dispatch(
      createUser(
        this.state.email,
        this.state.password,
        this.state.tos_privacy_agreement
      )
    );
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1500);
  };
  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={100}
        keyboardOpeningTime={10}
      >
        <Text style={styles.title}>One last thing...</Text>
        <Text style={styles.contentText}>
          You will need to create a password for logging in, and we will need
          your email for sending you notifications when you have a game
          scheduled as well as password reset.
        </Text>
        <View style={styles.inputForm}>
          <View style={styles.inputRow}>
            <Text style={styles.gamerLabel}>EMAIL</Text>
            <TextInput
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })}
              style={styles.inputGamer}
              placeholderStyle={{ color: "#606060" }}
              underlineColorAndroid={"transparent"}
              keyboardType={"email-address"}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.gamerLabel}>PASSWORD</Text>
            <TextInput
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
              style={styles.inputGamer}
              placeholderStyle={{ color: "#606060" }}
              underlineColorAndroid={"transparent"}
              secureTextEntry
            />
          </View>

          <CheckBox
            checkBoxColor="#949599"
            rightText="I agree to privacy policy and terms of service"
            rightTextStyle={styles.contentText}
            isChecked={this.state.tos_privacy_agreement}
            onClick={val =>
              this.setState({
                tos_privacy_agreement: !this.state.tos_privacy_agreement
              })
            }
          />
        </View>
        {this.state.loading ? (
          <TouchableOpacity style={styles.continueBtn}>
            <ActivityIndicator size={"small"} style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>CREATING...</Text>
          </TouchableOpacity>
        ) : this.state.email && this.state.password ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={this.sendUserInfo}
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
  inputForm: {
    alignSelf: "stretch"
  },
  inputRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingVertical: 20,
    alignItems: "center"
  },
  continueBtn: {
    flexDirection: "row",
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  btnText: {
    color: colors.white
  },
  gamerLabel: {
    flex: 1,
    fontSize: fontSizes.secondary,
    color: colors.white,
    opacity: colors.headlineOpacity
  },
  inputGamer: {
    flex: 3,
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
  onboarding: state.onboarding,
  authentication: state.authentication,
  users: state.users
});
export default connect(mapStateToProps)(connectAlert(CreateCredential));
