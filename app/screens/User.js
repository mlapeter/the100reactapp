import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import PreSplash from "../components/PreSplash/PreSplash";
import Chat from "../components/Chat/Chat";

import { colors, fontSizes } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export default class User extends React.Component {
  static navigationOptions = {
    title: "User"
  };

  constructor(props) {
    super(props);
    this.state = {
      hasJoined: false,
      isLoading: true,
      refreshing: false,
      gameData: ""
    };
    userId = this.props.navigation.state.params.userId;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    console.log("Fetching User");
    AsyncStorage.getItem("id_token").then(token => {
      console.log("token: " + token);
      fetch("https://the100.io/api/v2/users/" + userId, {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            isLoading: false,
            dataSource: responseJson
          });
          console.log(responseJson);
          return responseJson;
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  giveKarma() {
    this.postData("/give_karma");
    Alert.alert("Karma Given!");
  }

  addFriend() {
    this.postData("/add_friend");
    Alert.alert("Friend Request Sent!");
  }

  postData(action) {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("id_token").then(token => {
      console.log("token: " + token);
      fetch("https://the100.io/api/v2/users/" + userId + action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          this.fetchData();
          console.log("ACTION POSTED");
          console.log(responseJson);
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Image
            style={styles.profileAvatar}
            source={
              this.state.dataSource.computed_avatar_api ===
              "img/default-avatar.png"
                ? require("../images/default-avatar.png")
                : { uri: this.state.dataSource.computed_avatar_api }
            }
          />
          <View style={styles.titleAndTags}>
            <Text style={styles.title}>{this.state.dataSource.gamertag}</Text>
          </View>
          <View style={styles.actionButtons}>
            <FriendButton
              friendsWith={this.state.dataSource.karma_received_from}
              addFriend={this.addFriend.bind(this)}
            />
            <KarmaButton
              karmaReceivedFrom={this.state.dataSource.karma_received_from}
              giveKarma={this.giveKarma.bind(this)}
            />
          </View>
        </View>
        <Text style={styles.tagList}>
          <MaterialCommunityIcons name="tag" size={14} color={colors.grey} />
          {this.state.dataSource.tag_list.map(tag => tag + " ")}
        </Text>
        <Text style={styles.description} numberOfLines={4}>
          {this.state.dataSource.description != null
            ? this.state.dataSource.description
            : ""}
        </Text>
        <View style={styles.iconBar}>
          <PlatformIcon platform={this.state.dataSource.platform} />
          <PowerIcon lightLevel={this.state.dataSource.light_level} />
          <PlayScheduleIcon
            playSchedule={this.state.dataSource.play_schedule}
          />
        </View>
        <Chat chatroom={"help_chatroom"} />
      </View>
    );
  }
}

function KarmaButton(props) {
  console.log("User ID: " + userId);
  if (props.karmaReceivedFrom.includes(userId)) {
    return <Text>Karma Given</Text>;
  } else {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.giveKarma} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color={colors.mediumGrey}
            />
            Give Karma
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

function FriendButton(props) {
  console.log("User ID: " + userId);
  if (props.friendsWith.includes(userId)) {
    return <Text>Friends</Text>;
  } else {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.addFriend} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="account-plus"
              size={18}
              color={colors.mediumGrey}
            />
            Add Friend
          </Text>
        </TouchableHighlight>
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
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />
      <Text style={styles.icon}>{props.playSchedule.toString()}</Text>
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
    padding: 5,
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    margin: 5,
    flex: 1.4
  },
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    margin: 2
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  },
  profileAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    flex: 1
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 5
  },

  title: {
    padding: 5,
    color: colors.grey,
    fontFamily: "Futura",
    fontSize: fontSizes.primary
  },
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
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
