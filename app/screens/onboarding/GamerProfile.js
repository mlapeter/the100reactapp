import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { setProfileInfo } from "../../actions/onboarding";
import ListPopover from "../../components/ListPopover";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../../config/environment";

import { colors, fontSizes, fontStyles } from "../../styles";
import jstz from "jstz";

const { width, height } = Dimensions.get("window");

let items = [];
var ageOptions = _.range(13, 99);
var playStyleOptions = ["casual", "serious"];
var playScheduleOptions = [
  "Weekday Mornings and Weekends",
  "Weekday Afternoons and Weekends",
  "Weekday Evenings and Weekends",
  "Weekdays Latenight and Weekends"
];
let groupOptions = ["No Preference", "Parents", "College Students"];

class GamerProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playStyle: "casual",
      age: 25,
      playSchedule: "Weekday Evenings and Weekends",
      group: "NO PREFERENCE",
      isVisible: false,
      option: ""
    };
  }
  componentDidMount() {
    const time = jstz.determine();
    this.setState({ timezone: time.name() });
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Onboarding Screen 3"))
      .catch(e => console.log(e.message));
  }
  showPopover = option => {
    this.setState({ option: option });
    switch (option) {
      case "playStyle":
        items = playStyleOptions;
        break;
      case "age":
        items = ageOptions;
        break;
      case "playSchedule":
        items = playScheduleOptions;
        break;
      case "group":
        items = groupOptions;
        break;
      default:
        items = [];
        break;
    }
    this.setState({ isVisible: true });
  };
  setItem = item => {
    const key = this.state.option;
    var Obj = {};
    Obj[key] = item;
    this.setState(Obj);
  };
  closePopover = () => {
    this.setState({ isVisible: false });
  };
  setProfileInfo = () => {
    this.props.dispatch(
      setProfileInfo(
        this.state.timezone,
        this.state.playStyle,
        this.state.age,
        this.state.playSchedule,
        this.props.group
      )
    );
    this.props.navigation.navigate("CreateCredential");
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Getting to know you...</Text>
        <Text style={styles.contentText}>
          Just a few more things to match you with the perfect group...
        </Text>
        {/* Timezone not needed in form, should just be set automatically */}
        {/* <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>TIMEZONE</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.boxContent}>{this.state.timezone}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View> */}
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>PLAY STYLE</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => this.showPopover("playStyle")}
          >
            <Text style={styles.boxContent}>{this.state.playStyle}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>AGE</Text>
          <TouchableOpacity
            style={[styles.selectBox, { width: width * 0.35 }]}
            onPress={() => this.showPopover("age")}
          >
            <Text style={styles.boxContent}>{this.state.age}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>I USUALLY PLAY</Text>
          <TouchableOpacity
            style={[styles.selectBox, { width: width * 0.55 }]}
            onPress={() => this.showPopover("playSchedule")}
          >
            <Text style={styles.boxContent}>{this.state.playSchedule}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.gamerLabel}>GROUP PREFERENCE</Text>
          <TouchableOpacity
            style={[styles.selectBox, { width: width * 0.45 }]}
            onPress={() => this.showPopover("group")}
          >
            <Text style={styles.boxContent}>{this.state.group}</Text>
            <View style={styles.iconView}>
              <FontAwesome size={20} name="caret-down" color="#888888" />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={this.setProfileInfo}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
        </TouchableOpacity>
        <ListPopover
          list={items}
          isVisible={this.state.isVisible}
          onClick={this.setItem}
          onClose={this.closePopover}
        />
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
    fontSize: fontSizes.h2,
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
  inputRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between"
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
  selectBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#606060",
    height: 40,
    width: width * 0.4,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    backgroundColor: "#27292d"
  },
  boxContent: {
    color: "#9fa0a4"
  },
  iconView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 40,
    alignSelf: "stretch",
    backgroundColor: "#3f3f3f",
    justifyContent: "center",
    alignItems: "center"
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding
});
export default connect(mapStateToProps)(connectAlert(GamerProfile));
