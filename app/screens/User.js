import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AsyncStorage,
  Button,
  Clipboard,
  Image,
  Keyboard,
  LayoutAnimation,
  Linking,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

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

import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";

import { StackNavigator } from "react-navigation";

import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import TabButtons from "../components/TabButtons";
import UserIconBar from "../components/UserIconBar";
import GroupsList from "../components/GroupsList";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";

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
      conversation: this.findConversation(this.props),
      selectedIndex: 0
    };

    userId = this.props.navigation.state.params.userId;
    console.log("USER ID:", userId);
  }

  componentDidMount() {
    // this.fetchUserData();
    console.log("fetchuser: ", userId);
    this.props.dispatch(fetchUser(userId));
    this.props.dispatch(fetchConversations());
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - User Profile"))
      .catch(e => console.log(e.message));
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

  // fetchUserData() {
  //   console.log("Fetching User");
  //   this.props.dispatch(fetchUser(userId));
  // }

  giveKarma() {
    this.postData("/give_karma");
    this.props.alertWithType("success", "Success", "Karma Given!!");
  }

  addFriend() {
    this.postData("/add_friend");
    this.props.alertWithType("success", "Success", "Friend Request Sent!");
  }

  acceptFriend() {
    this.postData("/add_friend");
    this.props.alertWithType("success", "Success", "Friend Request Accepted!");
  }

  postData(action) {
    AsyncStorage.getItem("id_token").then(token => {
      fetch(
        Environment["API_BASE_URL"] +
          Environment["API_VERSION"] +
          "users/" +
          userId +
          action,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          this.props.dispatch(fetchUser(userId));
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

  copyToClipboard = text => {
    Clipboard.setString(text);
    this.props.alertWithType("info", "", "Gamertag copied to clipboard!");
  };

  onChange = index => {
    this.setState({
      selectedIndex: index
    });
  };

  render() {
    const { params } = this.props.navigation.state;
    const navigation = this.props.navigation;
    const onChange = this.onChange;
    const selectedIndex = this.state.selectedIndex;
    const rightAction = {
      icon: "chat-bubble-outline",
      onPress: () => {
        Alert.alert("Coming Soon", "Private Chat coming soon for supporters!");
      }
    };
    const rightAction2 =
      this.props.user.karma_status === "given"
        ? {
            icon: "star"
          }
        : {
            icon: "star-border",
            onPress: () => {
              this.giveKarma();
            }
          };
    const rightAction3 =
      this.props.user.friendship_status === "Friends" ||
      this.props.user.friendship_status === "Pending"
        ? {
            icon: "person-add"
          }
        : this.props.user.friendship_status === "Confirm Friend"
          ? {
              icon: "outline-person_add-24px",
              onPress: () => {
                this.acceptFriend();
              }
            }
          : {
              icon: "outline-person_add-24px",
              onPress: () => {
                this.addFriend();
              }
            };

    if (this.props.userLoading || this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.outerContainer}>
        <Header
          picture={this.props.user.header_background_image_api}
          heightRatio={0.8}
          topGradientTransparency={"rgba(0,0,0,0.7)"}
          middleGradientTransparency={"rgba(0,0,0,0.2)"}
          bottomGradientTransparency={"rgba(0,0,0,0.7)"}
        >
          <NavigationBar
            back="Back"
            type="transparent"
            {...{ navigation, rightAction, rightAction2, rightAction3 }}
          />
          <View style={styles.container}>
            <Image
              style={styles.avatar}
              source={
                this.props.user.computed_avatar_api === "img/default-avatar.png"
                  ? require("../assets/images/default-avatar.png")
                  : { uri: this.props.user.computed_avatar_api }
              }
            />
            <TouchableOpacity
              onLongPress={() => this.copyToClipboard(this.props.user.gamertag)}
              activeOpacity={0.6}
            >
              <Text
                color="white"
                style={[styles.text, styleSheet.typography["title3"]]}
              >
                {this.props.user.gamertag}
              </Text>
            </TouchableOpacity>

            <Panel
              text={
                this.props.user.tag_list != null &&
                this.props.user.tag_list.length > 0
                  ? this.props.user.tag_list.map(tag => tag + " ")
                  : null
              }
              numberOfLines={2}
              style={[styles.text, styleSheet.typography["callout"]]}
            />

            <TabButtons
              transparent
              values={["Details", "Groups", "Games"]}
              {...{ selectedIndex, onChange }}
            />
          </View>
        </Header>
        <UserIconBar
          platform={this.props.user.platform}
          lightLevel={this.props.user.light_level}
          karmasCount={this.props.user.karmas_count}
          playSchedule={this.props.user.play_schedule}
        />

        {this.state.selectedIndex === 0 ? (
          <Content style={styles.content}>
            {this.props.user.friendship_status === "Confirm Friend" ? (
              <Card
                onPress={() => {
                  this.acceptFriend();
                }}
              >
                <Text
                  style={[
                    { textAlign: "center", color: colors.primaryBlue },
                    styleSheet.typography["headline"]
                  ]}
                >
                  Accept Friend Request &raquo;
                </Text>
              </Card>
            ) : null}

            {this.props.user.description ? (
              <Card>
                <Panel text={this.props.user.description} numberOfLines={3} />
              </Card>
            ) : null}

            <Card
              onPress={() =>
                Linking.openURL(this.props.user.destiny_status_link)
              }
            >
              <Text
                style={[{ textAlign: "center" }, styleSheet.typography["body"]]}
              >
                View Destiny Status &raquo;
              </Text>
            </Card>
            <Card
              onPress={() =>
                Linking.openURL(this.props.user.destiny_tracker_link)
              }
            >
              <Text
                style={[{ textAlign: "center" }, styleSheet.typography["body"]]}
              >
                View Destiny Tracker &raquo;
              </Text>
            </Card>
          </Content>
        ) : null}
        {this.state.selectedIndex === 1 ? (
          <Content style={styles.content}>
            <GroupsList
              groups={this.props.user.groups}
              navigation={this.props.navigation}
            />
          </Content>
        ) : null}
        {this.state.selectedIndex === 2 ? (
          <Content style={styles.content}>
            <Card>
              <Panel text={"Games Coming Soon..."} numberOfLines={3} />
            </Card>
          </Content>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  outerContainer: {
    flex: 1
  },
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    marginHorizontal: styleSheet.spacing.small,
    flex: 1,
    justifyContent: "center"
  },
  avatar: {
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.white,
    marginVertical: styleSheet.spacing.tiny,
    height: 90,
    width: 90,
    alignSelf: "center"
  },
  text: {
    textAlign: "center",
    marginBottom: styleSheet.spacing.tiny,
    color: colors.white
  },
  content: {
    paddingBottom: styleSheet.spacing.small
  }
});

const mapStateToProps = state => {
  const currentUser = state.users.currentUser;
  const user = state.users.user;
  const users = state.users;
  const isUpdating = state.users.isUpdating;
  const userLoading = state.users.userLoading;
  const conversationsLoading = state.conversations.isLoading;
  const conversations = state.conversations.conversations;

  return {
    currentUser,
    user,
    users,
    isUpdating,
    userLoading,
    conversationsLoading,
    conversations
  };
};

export default connect(mapStateToProps)(connectAlert(User));
