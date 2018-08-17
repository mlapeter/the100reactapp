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

import { colors, fontSizes, fontStyles } from "../styles";
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

  // static navigationOptions = {
  //   header: null
  // };

  componentWillMount() {
    // AsyncStorage.getItem("default_group_id").then(groupId => {
    //   if (groupId) {
    //     this.props.dispatch(changeSelectedGroupId(groupId));
    //   }
    // });
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

    function JoinButton(props) {
      if (props.joined == null) {
        return (
          <View style={styles.icon}>
            <TouchableHighlight onPress={props.joinGroup} underlayColor="white">
              <Text style={styles.iconText}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={18}
                  color={colors.mediumGrey}
                />{" "}
                Join
              </Text>
            </TouchableHighlight>
          </View>
        );
      } else {
        return (
          <View style={styles.icon}>
            <TouchableHighlight
              onPress={props.leaveGroup}
              underlayColor="white"
            >
              <Text style={styles.iconText}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={18}
                  color={colors.mediumGrey}
                />{" "}
                Leave
              </Text>
            </TouchableHighlight>
          </View>
        );
      }
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
        <ImageBackground
          style={styles.backgroundImage}
          source={
            this.props.group.header_background_image_api ===
            "img/default-group-header.jpg"
              ? defaultGroupHeaderBackground
              : { uri: this.props.group.header_background_image_api }
          }
        >
          {/* <Text style={styles.title}>{this.props.group.name}</Text> */}
          <View>
            <Toggle
              title={this.props.group.name}
              toggle={() => this.toggleGroups()}
            />
          </View>
        </ImageBackground>
        <View style={styles.innerContainer}>
          {this.state.viewGroups ? (
            <View>
              <JoinButton
                joined={this.userHasJoined()}
                joinGroup={() => this.joinGroup()}
                leaveGroup={() => this.leaveGroup()}
              />
              <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
                <Button onPress={() => this.onShare()} title="Share" />
              </View>
              {this.props.groups.length > 1 ? (
                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.props.selectedGroupId}
                  onValueChange={groupId => {
                    this.props.dispatch(changeSelectedGroupId(groupId));
                    this.fetchGroupData();
                    this.toggleGroups();
                  }}
                >
                  {this.props.groups.map(group => (
                    <Picker.Item
                      key={group.id}
                      label={group.name}
                      value={group.id}
                    />
                  ))}
                </Picker>
              ) : null}
            </View>
          ) : null}

          <View style={styles.iconBar}>
            <PlatformIcon platform={this.props.group.platform} />
            <PlayerIcon usersCount={this.props.group.users_count} />
            <Text style={styles.icon}>
              <MaterialCommunityIcons
                name="human-greeting"
                size={14}
                color={colors.grey}
              />
              <Text style={styles.icon}>{this.props.group.play_style}</Text>
            </Text>
            <PlayScheduleIcon playSchedule={this.props.group.play_schedule} />
          </View>

          <Panel text={this.props.group.description} numberOfLines={3} />
          <Panel text={this.props.group.latest_news} numberOfLines={3} />

          <ChatPreview
            room={`group-${this.props.group.id}`}
            url={`chat/groups/group-${this.props.group.id}`}
            allowAnon={true}
            onOpenChat={() =>
              this.props.navigation.navigate("GroupChat", {
                title: `${this.props.group.name} Chat`,
                room: `group-${this.props.group.id}`,
                url: `chat/groups/group-${this.props.group.id}`,
                allowAnon: false
              })}
          />
        </View>
      </View>
    );
  }
}

function Toggle(props) {
  return (
    <View>
      <TouchableHighlight onPress={props.toggle} underlayColor="white">
        <Text style={styles.title}>
          {props.title}{" "}
          <MaterialCommunityIcons
            name="settings"
            size={15}
            color={colors.white}
          />
        </Text>
      </TouchableHighlight>
    </View>
  );
}

function KarmaButton(props) {
  if (props.karmaReceivedFrom.includes(userId)) {
    return <Text>Karma Given</Text>;
  } else {
    return (
      <View>
        <Button
          style={{
            height: 30,
            width: 150,
            margin: 5
          }}
          onPress={props.giveKarma}
          title="Give Karma"
        />
      </View>
    );
  }
}

function FriendButton(props) {
  if (props.friendsWith.includes(userId)) {
    return <Text>Friends</Text>;
  } else {
    return (
      <View>
        <Button
          style={{
            height: 30,
            width: 150,
            margin: 5
          }}
          onPress={props.addFriend}
          title="Add Friend"
        />
      </View>
    );
  }
}

function PlatformIcon(props) {
  if (props.platform === "ps4") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="playstation"
          size={14}
          color={colors.grey}
        />
        PS4
      </Text>
    );
  } else if (props.platform === "xbox-one") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="xbox" size={14} color={colors.grey} />
        XBOX
      </Text>
    );
  } else {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="microsoft"
          size={14}
          color={colors.grey}
        />
        PC
      </Text>
    );
  }
}

function PlayScheduleIcon(props) {
  var schedule = props.playSchedule
    .split(" ")
    .slice(0, 2)
    .join(" ");

  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />
      <Text style={styles.icon}>{schedule}</Text>
    </Text>
  );
}

function PlayerIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.usersCount}
    </Text>
  );
}

function PowerIcon(props) {
  if (props.lightLevel) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
        {props.lightLevel}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
      Any
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    justifyContent: "center",
    alignItems: "stretch"
  },
  backgroundImage: {
    // resizeMode: "cover", // or 'stretch'
    height: 150,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    backgroundColor: "rgba( 0, 0, 0, 0.5 )",
    borderRadius: 3,
    color: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
  },
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  icon: {
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary,
    padding: 5
  },
  tagList: {
    padding: 5,
    paddingBottom: 10,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  },
  titleAndTags: {
    flexDirection: "column",
    flex: 2
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
