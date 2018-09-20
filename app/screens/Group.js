import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  ImageBackground,
  LayoutAnimation,
  ListView,
  Picker,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View
} from "react-native";
import PreSplash from "../components/PreSplash/PreSplash";
import ChatPreview from "../components/ChatPreview";
import Environment from "../config/environment";

import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";
import Panel from "../components/Panel/Panel";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchGroup, changeSelectedGroupId } from "../actions/group";

import { firebaseSignOut } from "../utils/user";
import { removeToken } from "../actions/authentication";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";
import IconBar from "../components/IconBar";

import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class Group extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    groupError: PropTypes.string,
    group: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      viewGroups: false
      // isLoading: true
    };
  }

  componentWillMount() {
    this.fetchGroupData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.groupError &&
      nextProps.groupError !== this.props.groupError
    ) {
      this.props.alertWithType("error", "Error", nextProps.groupError);
    }
  }

  fetchGroupData = () => {
    console.log("Fetching Group");
    this.props.dispatch(fetchGroup());
  };

  toggleGroups() {
    this.setState({
      viewGroups: !this.state.viewGroups
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  userHasJoined() {
    let joined = this.props.groups.find(group => {
      return group.id === this.props.group.id;
    });
    return joined;
  }

  joinGroup() {
    this.postData(this.props.group.id + "/join");
    this.fetchGroupData();
    Alert.alert("Group Joined!");
  }

  leaveGroup() {
    this.postData(this.props.group.id + "/leave");
    this.fetchGroupData();
    Alert.alert("Group Left.");
  }

  autoJoinGroup() {
    this.postData("autojoin");
    Alert.alert("Group Auto Joined!");
  }

  onShare() {
    Share.share(
      {
        message:
          Platform.OS === "android"
            ? "Join " +
              this.props.group.name +
              " " +
              "https://the100.io/groups/" +
              this.props.group.id
            : "Join " + this.props.group.name,
        url: "https://the100.io/groups/" + this.props.group.id,
        title: ""
      },
      {
        // Android only:
        dialogTitle: "Share Group Link"
      }
    );
  }

  postData(action) {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("id_token").then(token => {
      fetch(
        Environment["API_BASE_URL"] +
          Environment["API_VERSION"] +
          "groups/" +
          action,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            // group_id: this.props.group.id
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("ACTION POSTED");
          console.log(responseJson);
          this.fetchGroupData();
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    function AutoJoinButton(props) {
      return (
        <View style={styles.icon}>
          <TouchableHighlight onPress={props.onPress} underlayColor="white">
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="account-plus"
                size={18}
                color={colors.mediumGrey}
              />{" "}
              Automatically Join A Matching Group
            </Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (this.props.isLoading || this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else if (!this.props.group) {
      return (
        <View style={styles.container}>
          <AutoJoinButton onPress={() => this.autoJoinGroup()} />
        </View>
      );
    }

    let room = `group-${this.props.group.id}`;
    let url = `chat/groups/${room}`;

    return (
      <View style={styles.container}>
        <Header
          title={this.props.group.name}
          picture={this.props.group.header_background_image_api}
        />
        <IconBar
          details={[
            { icon: "albums", caption: "PS4" },
            {
              icon: "account",
              caption: this.props.group.users_count
            },
            { icon: "time", caption: "evenings" },
            { icon: "share", caption: "share" }
          ]}
        />
        <Content style={styles.gutter}>
          <Card>
            <Panel text={this.props.group.description} numberOfLines={3} />
          </Card>
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gutter: {
    padding: styleSheet.spacing.tiny
  },

  container: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    group: state.group.group,
    isLoading: state.group.isLoading,
    groupError: state.group.error,
    groups: state.users.currentUser.groups,
    selectedGroupId: state.group.selectedGroupId,
    user: state.users.currentUser
  };
};

export default connect(mapStateToProps)(connectAlert(Group));
