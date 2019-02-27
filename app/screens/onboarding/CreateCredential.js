import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { createUser } from "../../actions/onboarding";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../../config/environment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "react-native-check-box";
import { colors, fontSizes, fontStyles } from "../../styles";


class CreateCredential extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      tos_privacy_agreement: true,
      loading: false,
      loadingText: "Searching Groups..."
    };
  }

  componentDidMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Onboarding Screen 4"))
      .catch(e => console.log(e.message));
  }

  componentWillUnmount() {
    console.log("UNMOUNTING CREATE CREDENTIAL");
    if (this.loadingTextTimer) {
      clearTimeout(this.loadingTextTimer);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.onboarding.error &&
      nextProps.onboarding.errorAt !== this.props.onboarding.errorAt
    ) {
      this.props.alertWithType("error", "Error", nextProps.onboarding.error);
      this.setState({ loading: false })
    }
    if (nextProps.users.userCreated) {
      this.props.alertWithType("success", "Success", "Account Created!");
      this.props.navigation.navigate("App");
    }
  }
  sendUserInfo = () => {
    this.setState({ loading: true });
    this.props.dispatch(
      createUser(
        this.state.email,
        this.state.password,
        this.state.tos_privacy_agreement
      )
    );
    this.setState({ loading: true })

    this.loadingTextTimer = setTimeout(() => {
      this.setState({
        loadingText: "Group Found! Joining..."
      });
    }, 1500);

  };
  render() {

    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} />
          <Text style={styles.title}>{this.state.loadingText}</Text>
        </View>
      )
    }

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
        {this.state.email && this.state.password ? (
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
    backgroundColor: colors.veryDarkGrey,
    paddingTop: 40
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding,
  authentication: state.authentication,
  users: state.users
});
export default connect(mapStateToProps)(connectAlert(CreateCredential));
