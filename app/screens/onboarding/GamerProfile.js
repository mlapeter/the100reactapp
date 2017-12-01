import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TextInput
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons"
import ListPopover from "../../components/ListPopover";

import { colors, fontSizes, fontStyles } from "../../styles";

const { width, height } = Dimensions.get("window");

class GamerProfile extends Component {
  constructor (props) {
    super(props);

    this.state = {
      timezone: "EST",
      mostPlay: "DESTINY",
      age: 30,
      playTime: "WEEKDAYS AND LAST NIGHT",
      groupPref: "NO PREFERENCE",
      isVisible: false
    }
  }
  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraHeight={100}
        keyboardOpeningTime={10}
      >
        <Text style={styles.title}>Getting to know you...</Text>
        <Text style={styles.contentText}>
          Just a few more things to match you with the perfect group...
        </Text>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>TIMEZONE</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.boxContent}>{this.state.timezone}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>I MOSTLY PLAY</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.boxContent}>{this.state.mostPlay}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>AGE</Text>
          <TouchableOpacity style={[styles.selectBox, {width: width * 0.35}]}>
            <Text style={styles.boxContent}>{this.state.age}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>I USUALLY PLAY</Text>
          <TouchableOpacity style={[styles.selectBox, {width: width * 0.55}]}>
            <Text style={styles.boxContent}>{this.state.playTime}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>GROUP PREFERENCE</Text>
          <TouchableOpacity style={[styles.selectBox, { width: width * 0.45}]}>
            <Text style={styles.boxContent}>{this.state.groupPref}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
        </TouchableOpacity>
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
    fontSize: fontSizes.h2,
    color: colors.onboardingTitle,
    textAlign: "left"
  },
  contentText: {
    fontSize: fontSizes.secondary,
    color: colors.onboardingText,
    paddingVertical: 15
  },
  inputRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
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
  selectBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#606060",
    height: 40,
    width: width * 0.4,
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: "#27292d",
  },
  boxContent: {
    color: "#9fa0a4"
  },
  iconView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right:0,
    width: 40,
    alignSelf: "stretch",
    backgroundColor: "#3f3f3f",
    justifyContent: "center",
    alignItems: "center"
  }
};
export default GamerProfile;