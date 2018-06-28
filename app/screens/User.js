import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
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
import ChatPreview from "../components/ChatPreview";
import Panel from "../components/Panel/Panel";

import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  fetchUser,
  fetchFriends,
  fetchPendingFriends,
  fetchGroupMembers
} from "../actions/users";
import { fetchConversations } from "../actions/conversations";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import { StackNavigator } from "react-navigation";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export class User extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    conversationsLoading: PropTypes.bool.isRequired,
    conversations: PropTypes.arrayOf(PropTypes.object.isRequired)
  };

  constructor(props) {
    super(props);

    this.state = {
      hasJoined: false,
      isLoading: false,
      refreshing: false,
      gameData: "",
      viewStats: false,
      conversation: this.findConversation(this.props)
    };

    userId = this.props.navigation.state.params.userId;
    console.log("USER ID:", userId);
  }

  componentDidMount() {
    this.fetchUserData();

    this.props.dispatch(fetchConversations());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userError && nextProps.userError !== this.props.userError) {
      this.props.alertWithType(
        "error",
        "Error",
        "User ID:" + userId + nextProps.userError
      );
    }

    let conversation = this.findConversation(nextProps);
    this.setState(prevState => {
      if (prevState.conversation !== conversation) {
        return { conversation: conversation };
      }
    });
  }

  findConversation(props) {
    if (
      !props.conversationsLoading &&
      props.conversations &&
      props.conversations.length > 0
    ) {
      return props.conversations.find(
        convo => convo.other_user.id === props.user.id
      );
    } else {
      return null;
    }
  }

  fetchUserData() {
    console.log("Fetching User");
    this.props.dispatch(fetchUser(userId));
  }

  giveKarma() {
    this.postData("/give_karma");
    this.props.navigation.navigate("Games");
    this.props.alertWithType("success", "Success", "Karma Given!!");
  }

  addFriend() {
    this.postData("/add_friend");
    this.props.navigation.navigate("FriendsList");
    this.props.alertWithType("success", "Success", "Friend Request Sent!");
  }

  acceptFriend() {
    this.postData("/add_friend");
    this.props.navigation.navigate("FriendsList");
    this.props.alertWithType("success", "Success", "Friend Request Accepted!");
  }

  toggleStats() {
    this.setState({
      viewStats: !this.state.viewStats
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  destinyStatusLink() {
    Linking.openURL(this.props.user.destiny_status_link);
  }

  checkFriendStatus() {
    this.postData("/add_friend");
    this.props.alertWithType("success", "Success", "Friend Request Sent!");
  }

  openChat = () => {
    if (this.state.conversation) {
      let room = `conversation-${this.state.conversation.id}`;
      let url = `chat/conversations/${room}`;
      this.props.navigation.navigate("Conversation", {
        title: `Conversation with ${this.props.user.gamertag}`,
        url: url,
        room: room,
        allowAnon: false
      });
    }
  };

  postData(action) {
    // this.setState({
    //   isLoading: true
    // });
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
          this.fetchUserData();

          this.props.dispatch(fetchFriends());
          this.props.dispatch(fetchGroupMembers());
          this.props.dispatch(fetchPendingFriends());

          console.log("ACTION POSTED");
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.props.userLoading || this.state.isLoading) {
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
                Linking.openURL(this.props.user.destiny_status_link)}
              underlayColor="white"
            >
              <Text>Destiny Status</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.statsLink}>
            <TouchableHighlight
              onPress={() =>
                Linking.openURL(this.props.user.destiny_tracker_link)}
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

    if (this.props.user.tag_list.length > 0) {
      tags = (
        <View style={styles.tagList}>
          <MaterialCommunityIcons name="tag" size={14} color={colors.grey} />
          <Panel
            text={this.props.user.tag_list.map(tag => tag + " ")}
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
              this.props.user.computed_avatar_api === "img/default-avatar.png"
                ? require("../assets/images/default-avatar.png")
                : { uri: this.props.user.computed_avatar_api }
            }
          />
          <View style={styles.titleAndTags}>
            <Text style={styles.title}>{this.props.user.gamertag}</Text>
            <SupporterBadge supporter={this.props.user.supporter} />
          </View>
          <View style={styles.actionButtons}>
            <FriendButton
              friendshipStatus={this.props.user.friendship_status}
              addFriend={() => this.addFriend()}
              acceptFriend={() => this.acceptFriend()}
            />
            <KarmaButton
              karmaStatus={this.props.user.karma_status}
              karmaReceivedFrom={this.props.user.karma_received_from}
              currentUser={this.props.currentUser}
              giveKarma={() => this.giveKarma()}
            />
            <StatsButton
              toggleStats={() => this.toggleStats()}
              destinyStatusLink={() => this.destinyStatusLink()}
            />
            {this.state.conversation && <ChatButton onPress={this.openChat} />}
          </View>
        </View>
        <View>{stats}</View>
        <View style={{ marginRight: 4, paddingRight: 4 }}>{tags}</View>
        <Panel text={this.props.user.description} numberOfLines={3} />
        <View style={styles.iconBar}>
          <PlatformIcon platform={this.props.user.platform} />
          <PowerIcon lightLevel={this.props.user.light_level} />
          <KarmaIcon karmasCount={this.props.user.karmas_count} />
          <PlayScheduleIcon playSchedule={this.props.user.play_schedule} />
        </View>
        {this.state.conversation && (
          <ChatPreview
            room={`conversation-${this.state.conversation.id}`}
            url={`chat/conversations/conversation-${this.state.conversation
              .id}`}
            allowAnon={true}
            onOpenChat={this.openChat}
          />
        )}
      </View>
    );
  }
}

function KarmaButton(props) {
  if (props.karmaStatus === "given") {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={null} underlayColor="white">
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
        <TouchableHighlight onPress={null} underlayColor="white">
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
  } else if (props.friendshipStatus === "Confirm Friend") {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={props.acceptFriend} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="account-plus"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            Accept Invite
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

class ChatButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  };

  render() {
    return (
      <View style={styles.icon}>
        <TouchableHighlight onPress={this.props.onPress} underlayColor="white">
          <Text style={styles.iconText}>
            <MaterialCommunityIcons
              name="forum"
              size={18}
              color={colors.mediumGrey}
            />{" "}
            Message
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
  return {
    currentUser: state.authentication.user,
    user: state.users.user,
    userLoading: state.users.userLoading,
    userError: state.users.error,
    conversationsLoading: state.conversations.isLoading,
    conversations: state.conversations.conversations
  };
};

export default connect(mapStateToProps)(connectAlert(User));
