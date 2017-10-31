import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AsyncStorage,
  Button,
  Image,
  Keyboard,
  LayoutAnimation,
  Linking,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import PreSplash from "../components/PreSplash/PreSplash";
import Chat from "../components/Chat/Chat";
import Panel from "../components/Panel/Panel";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { fetchUser } from "../actions/users";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import { StackNavigator } from "react-navigation";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasJoined: false,
      // isLoading: true,
      refreshing: false,
      gameData: "",
      viewStats: false
    };
    userId = this.props.navigation.state.params.userId;
    console.log("USER ID:", userId);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userError && nextProps.userError !== this.props.userError) {
      this.props.alertWithType(
        "error",
        "Error",
        "User ID:" + userId + nextProps.userError
      );
    }
  }

  fetchData() {
    console.log("Fetching User");
    this.props.dispatch(fetchUser(userId));
  }

  giveKarma() {
    this.postData("/give_karma");
    this.props.alertWithType("success", "Success", "Karma Given!");
  }

  addFriend() {
    this.postData("/add_friend");
    this.props.alertWithType("success", "Success", "Friend Request Sent!");
  }

  toggleStats() {
    this.setState({
      viewStats: !this.state.viewStats
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  destinyStatusLink() {
    Linking.openURL(this.props.dataSource.destiny_status_link);
  }

  checkFriendStatus() {
    this.postData("/add_friend");
    this.props.alertWithType("success", "Success", "Friend Request Sent!");
  }

  postData(action) {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("id_token").then(token => {
      fetch("https://pwntastic.herokuapp.com/api/v2/users/" + userId + action, {
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
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.props.userLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.viewStats) {
      stats = (
        <View style={styles.statsContainer}>
          <View style={styles.statsLink}>
            <TouchableHighlight
              onPress={() =>
                Linking.openURL(this.props.dataSource.destiny_status_link)}
              underlayColor="white"
            >
              <Text>Destiny Status</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.statsLink}>
            <TouchableHighlight
              onPress={() =>
                Linking.openURL(this.props.dataSource.destiny_tracker_link)}
              underlayColor="white"
            >
              <Text>Destiny Tracker</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    } else {
      stats = null;
    }

    if (this.props.dataSource.tag_list.length > 0) {
      tags = (
        <View style={styles.tagList}>
          <MaterialCommunityIcons name="tag" size={14} color={colors.grey} />
          <Panel
            text={this.props.dataSource.tag_list.map(tag => tag + " ")}
            numberOfLines={1}
          />
        </View>
      );
    } else {
      tags = null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Image
            style={styles.profileAvatar}
            source={
              this.props.dataSource.computed_avatar_api ===
              "img/default-avatar.png"
                ? require("../images/default-avatar.png")
                : { uri: this.props.dataSource.computed_avatar_api }
            }
          />
          <View style={styles.titleAndTags}>
            <Text style={styles.title}>{this.props.dataSource.gamertag}</Text>
            <SupporterBadge supporter={this.props.dataSource.supporter} />
          </View>
          <View style={styles.actionButtons}>
            <FriendButton
              friendshipStatus={this.props.dataSource.friendship_status}
              addFriend={() => this.addFriend()}
            />
            <KarmaButton
              karmaStatus={this.props.dataSource.karma_status}
              karmaReceivedFrom={this.props.dataSource.karma_received_from}
              currentUser={this.props.user}
              giveKarma={() => this.giveKarma()}
            />
            <StatsButton
              toggleStats={() => this.toggleStats()}
              destinyStatusLink={() => this.destinyStatusLink()}
            />
          </View>
        </View>
        <View>{stats}</View>
        <View style={{ marginRight: 4, paddingRight: 4 }}>{tags}</View>
        <Panel text={this.props.dataSource.description} numberOfLines={3} />
        <View style={styles.iconBar}>
          <PlatformIcon platform={this.props.dataSource.platform} />
          <PowerIcon lightLevel={this.props.dataSource.light_level} />
          <KarmaIcon karmasCount={this.props.dataSource.karmas_count} />
          <PlayScheduleIcon
            playSchedule={this.props.dataSource.play_schedule}
          />
        </View>
        <Chat chatroom={"help_chatroom"} />
      </View>
    );
  }
}

function KarmaButton(props) {
  if (props.karmaStatus === "given") {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.giveKarma} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            Karma Given
          </Text>
        </TouchableHighlight>
      </View>
    );
  } else {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.giveKarma} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            Give Karma
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

function FriendButton(props) {
  if (
    props.friendshipStatus === "Friends" ||
    props.friendshipStatus === "Pending"
  ) {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.addFriend} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="account-plus"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            {props.friendshipStatus}
          </Text>
        </TouchableHighlight>
      </View>
    );
  } else {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.addFriend} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="account-plus"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            Add Friend
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

function StatsButton(props) {
  return (
    <View style={styles.icon}>
      <TouchableHighlight onPress={props.toggleStats} underlayColor="white">
        <Text style={styles.iconText}>
          <MaterialCommunityIcons
            name="chart-bar"
            size={18}
            color={colors.mediumGrey}
          />{" "}
          View Stats
        </Text>
      </TouchableHighlight>
    </View>
  );
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

function KarmaIcon(props) {
  if (props.karmasCount) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="star" size={14} color={colors.grey} />
        {props.karmasCount}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="star" size={14} color={colors.grey} />
      New!
    </Text>
  );
}

function SupporterBadge(props) {
  if (props.supporter) {
    return (
      <View style={styles.supporterBadge}>
        <Text style={styles.supporterText}>
          <Octicons name="flame" size={14} color={colors.white} />
          SUPPORTER
        </Text>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    paddingTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // marginBottom: 5,
    flex: 1.3
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
    padding: 3,
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  iconText: {
    marginLeft: 3,
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  },
  supporterText: {
    padding: 3,
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: fontSizes.small,
    color: colors.white
  },
  supporterBadge: {
    margin: 5,
    backgroundColor: colors.blue,
    width: 100,
    alignItems: "center",
    borderRadius: 3
  },
  profileAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40
    // flex: 1
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
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
  },
  statsContainer: {
    margin: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  statsLink: {
    margin: 5,
    padding: 5
  },
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  },
  tagList: {
    flexDirection: "row",
    alignItems: "center"
    // paddingBottom: 10
    // color: colors.lightGrey,
    // fontSize: fontSizes.secondary
  },
  titleAndTags: {
    flexDirection: "column",
    flex: 2
  }
});

const mapStateToProps = state => {
  const user = state.authentication.user;
  const dataSource = state.users.user;
  const userLoading = state.users.userLoading;

  return {
    user,
    dataSource,
    userLoading,
    userError: state.users.error

    // authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(User));
