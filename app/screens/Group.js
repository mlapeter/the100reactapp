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
import { Analytics, PageHit } from "expo-analytics";
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
import { fetchGroup } from "../actions/group";
import { fetchCurrentUser } from "../actions/users";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";
import IconBar from "../components/IconBar";

import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import GroupIconBar from "../components/GroupIconBar";

// import { SmallIconBar } from "./GroupOld";

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
      isLoading: true
    };
  }

  componentWillMount() {
    console.log("Mounting Group Screen");
    this.fetchGroupData();
    this.loadingTimer = setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 500);
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Group"))
      .catch(e => console.log(e.message));
  }

  componentWillUnmount() {
    console.log("UNMOUNTING GROUP");
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
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
    this.props.dispatch(fetchGroup(this.props.navigation.state.params.groupId));
    this.props.dispatch(fetchCurrentUser());
  };

  userHasJoined = () => {
    let joined = this.props.groups.find(group => {
      return group.id === this.props.group.id;
    });
    return joined;
  };

  joinGroup() {
    this.postData(this.props.group.id + "/join");
    Alert.alert("Group Joined!");
  }

  leaveGroup() {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group?",
      [
        {
          text: "Leave Group",
          onPress: () => this.postData(this.props.group.id + "/leave")
        },
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  onShare = () => {
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
  };

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
          body: JSON.stringify({})
        }
      )
        .then(response => response.json())
        .then(responseJson => {
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
    let navigation = this.props.navigation;
    if (
      this.props.isLoading ||
      this.state.isLoading ||
      !this.props.group ||
      !this.props.groups
    ) {
      console.log("group loading");
      return (
        <View style={styles.container}>
          <Header
            title={"..."}
            picture={"img/default-user-header.jpg"}
            heightRatio={0.5}
            topGradientTransparency={"rgba(0,0,0,0.9)"}
            middleGradientTransparency={"rgba(0,0,0,0.9)"}
            bottomGradientTransparency={"rgba(0,0,0,0.9)"}
          >
            <NavigationBar back="Back" type="transparent" {...{ navigation }} />
          </Header>
          <Content style={styles.gutter}>
            <ActivityIndicator style={styles.loading} />
          </Content>
        </View>
      );
    }

    const room = `group-${this.props.group.id}`;
    const url = `chat/groups/group-${this.props.group.id}`;
    let openChat = () =>
      this.userHasJoined()
        ? this.props.navigation.navigate("GroupChat", {
            title: `${this.props.group.name} Chat`,
            room: `group-${this.props.group.id}`,
            url: `chat/groups/group-${this.props.group.id}`,
            allowAnon: false
          })
        : Alert.alert("", "Join this group first to get full acess to chat!");

    const rightAction = {
      icon: "share",
      onPress: this.onShare
    };
    const rightAction2 = this.userHasJoined()
      ? {
          icon: "cancel",
          text: "Leave",
          size: 24,
          onPress: () => {
            this.leaveGroup();
          }
        }
      : {
          icon: "outline-person_add-24px",
          text: "Join",
          size: 26,
          onPress: () => {
            this.joinGroup();
          }
        };
    return (
      <View style={styles.container}>
        <Header
          title={this.props.group.name}
          picture={this.props.group.header_background_image_api}
          heightRatio={0.5}
          topGradientTransparency={"rgba(0,0,0,0.3)"}
          middleGradientTransparency={"rgba(0,0,0,0.0)"}
          bottomGradientTransparency={"rgba(0,0,0,0.4)"}
        >
          <NavigationBar
            type="transparent"
            back="Back"
            {...{ navigation, rightAction, rightAction2 }}
          />
        </Header>
        <GroupIconBar
          platform={this.props.group.platform}
          users_count={this.props.group.users_count}
          play_style={this.props.group.play_style}
          play_schedule={this.props.group.play_schedule}
        />

        <Content style={styles.gutter}>
          {this.props.group.latest_news ? (
            <Card>
              <Panel
                text={this.props.group.latest_news}
                numberOfLines={3}
                style={[styleSheet.typography["body"]]}
              />
            </Card>
          ) : null}

          {this.props.group.description ? (
            <Card>
              <Panel
                text={this.props.group.description}
                numberOfLines={3}
                style={[styleSheet.typography["body"]]}
              />
            </Card>
          ) : null}

          <Card onPress={openChat}>
            <Text style={[styles.headline, styleSheet.typography["headline"]]}>
              Latest Activity &raquo;
            </Text>

            <ChatPreview
              room={room}
              url={url}
              allowAnon={true}
              onOpenChat={openChat}
            />
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
  },
  loading: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    group: state.group.group,
    isLoading: state.group.isLoading,
    groupError: state.group.error,
    groups: state.users.currentUser.groups
    // user: state.users.currentUser
  };
};

export default connect(mapStateToProps)(connectAlert(Group));
