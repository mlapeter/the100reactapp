import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../../config/environment";

import { setPlatform } from "../../actions/onboarding";

import { colors, fontSizes, fontStyles } from "../../styles";

import ICPlaystation from "../../assets/images/ic-playstation.png";
import ICSbox from "../../assets/images/ic-sbox.png";
import ICWindows from "../../assets/images/ic-windows.png";

const { width, height } = Dimensions.get("window");
class ChoosePlatform extends Component {
  componentDidMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics.hit(new PageHit("App - Onboarding Screen 1"));
  }

  selectPlatform(platform) {
    this.props.dispatch(setPlatform(platform));
    this.props.navigation.navigate("CreateGamer", { platform: platform });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ready To Group Up?</Text>
        <Text style={styles.contentText}>
          Welcome to The100.io! You're 30 seconds away from a great group of
          like-minded gamers.
        </Text>
        <Text style={styles.quote}>
          Choose the platform you most frequently game on:
        </Text>
        <View style={styles.osButtonGroup}>
          <TouchableOpacity
            style={styles.psBtn}
            onPress={() => this.selectPlatform("ps4")}
          >
            <Image source={ICPlaystation} style={styles.btnImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sboxBtn}
            onPress={() => this.selectPlatform("xbox-one")}
          >
            <Image source={ICSbox} style={styles.btnImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.windowsBtn}
            onPress={() => this.selectPlatform("pc")}
          >
            <Image source={ICWindows} style={styles.btnImage} />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingVertical: 25
  },
  quote: {
    fontSize: fontSizes.secondary,
    fontFamily: fontStyles.primaryFont,
    fontWeight: "bold",
    color: colors.white,
    opacity: colors.primaryOpacity
  },
  osButtonGroup: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch"
  },
  psBtn: {
    backgroundColor: "#3763c1",
    width: 90,
    alignItems: "center",
    borderRadius: 5
  },
  sboxBtn: {
    backgroundColor: "#5dc21e",
    width: 90,
    alignItems: "center",
    borderRadius: 5
  },
  windowsBtn: {
    backgroundColor: "#00adef",
    width: 90,
    alignItems: "center",
    borderRadius: 5
  },
  btnImage: {
    width: 60,
    height: 60
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding
});

export default connect(mapStateToProps)(connectAlert(ChoosePlatform));
