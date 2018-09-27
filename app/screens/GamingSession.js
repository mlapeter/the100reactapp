import * as _ from "lodash";

import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  ListView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomButton from "../components/CustomButton";
import Touchable from "react-native-platform-touchable";
import Environment from "../config/environment";
import ChatPreview from "../components/ChatPreview";
import Panel from "../components/Panel/Panel";
import PlayersList from "../components/PlayersList/PlayersList";
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  fetchGamingSession,
  fetchGamingSessions,
  fetchMyGamingSessions,
  fetchGroupGamingSessions,
  refreshMyGamingSessions
} from "../actions/gamingSessions";

import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import SegmentedControl from "../components/SegmentedControl";
import UserIconBar from "../components/UserIconBar";
import GroupsList from "../components/GroupsList";
import SketchButton from "../components/SketchButton";
import GamingSessionIconBar from "../components/GamingSessionIconBar";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";
import destinyActivities from "../utils/destinyActivities.json";
// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class GamingSession extends React.Component {
  static navigationOptions = () => {
    // headerTitle: "Game";
    // Not Working
  };

  constructor(props) {
    super(props);
    this.state = {
      hasJoined: false,
      refreshing: false,
      gameData: "",
      reserveButtonVisible: false
    };
    gamingSessionId = this.props.navigation.state.params.gamingSessionId;
  }

  componentDidMount() {
    this.fetchGamingSessionData();
  }

  fetchGamingSessionData() {
    this.props.dispatch(fetchGamingSession(gamingSessionId));
  }

  joinGame = () => {
    this.postData("/join");
  };

  joinGameAsReserve = () => {
    this.postData("/join?join_as_reserve=true");
    this.onLongPress();
  };

  leaveGame = () => {
    this.postData("/leave");
  };

  fetchBungieImage = name => {
    let formattedName = name;
    let imageUrl = null;
    if (name.includes("Spire of Stars")) {
      formattedName = "Leviathan, Spire of Stars: Normal";
    } else if (name.includes("Last Wish")) {
      formattedName = "Last Wish: Normal";
    } else if (name.includes("Eater of Worlds")) {
      formattedName = "Leviathan, Eater of Worlds";
    } else if (name.includes("Leviathan")) {
      formattedName = "Leviathan";
    } else if (name.includes("Shattered Throne")) {
      formattedName = "The Shattered Throne";
    } else if (name.includes("Whisper of the Worm")) {
      imageUrl =
        "https://www.bungie.net/img/destiny_content/pgcr/patrol_io.jpg";
    } else {
      imageUrl =
        "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/placeholder.jpg";
    }
    if (imageUrl) {
      return imageUrl;
    } else {
      var result = destinyActivities.find(obj => {
        return obj.name === formattedName;
      });
      console.log(result);
      return "https://www.bungie.net" + result.pgcrImage;
    }
  };

  postData(action) {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("id_token").then(token => {
      fetch(
        Environment["API_BASE_URL"] +
          Environment["API_VERSION"] +
          "gaming_sessions/" +
          gamingSessionId +
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
          if (action === "/join" || action === "/join?join_as_reserve=true") {
            this.fetchGamingSessionData();
            console.log("GAME JOINED");
            // this.setState({
            //   isLoading: false
            // });
          } else {
            this.props.navigation.navigate("GamingSessionsList");
            console.log("GAME LEFT");
          }
          setTimeout(() => {
            this.props.dispatch(fetchMyGamingSessions());
            this.props.dispatch(fetchGroupGamingSessions());
            this.setState({
              isLoading: false
            });
          }, 500);
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  onShare() {
    Share.share(
      {
        message:
          Platform.OS === "android"
            ? "New game, join up! " +
              this.props.gamingSession.category.toString() +
              " " +
              "https://the100.io/game/" +
              this.props.gamingSession.id
            : "New game, join up! " +
              this.props.gamingSession.category.toString() +
              " ",
        url: "https://the100.io/game/" + this.props.gamingSession.id,
        title: ""
      },
      {
        // Android only:
        dialogTitle: "Share Gaming Session"
      }
    );
  }

  onLongPress = () => {
    this.setState({
      reserveButtonVisible: !this.state.reserveButtonVisible
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  render() {
    const { params } = this.props.navigation.state;
    const navigation = this.props.navigation;

    const rightAction = {
      icon: "outline-person_add-24px",
      onPress: () => {
        alert("Private Chat coming soon for supporters!");
      }
    };
    const rightAction2 = {
      icon: "share",
      onPress: () => {
        this.onShare();
      }
    };

    if (
      this.state.isLoading ||
      this.props.gamingSessionLoading ||
      !this.props.gamingSession.confirmed_sessions
    ) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    let room = `game-${this.props.gamingSession.id}`;
    let url = `chat/gaming_sessions/${room}`;

    var userIds = [];
    this.props.gamingSession.confirmed_sessions.map(confirmedSession =>
      userIds.push(confirmedSession.user_id)
    );

    return (
      <View style={styles.container}>
        <Header
          title={this.props.gamingSession.category}
          picture={this.fetchBungieImage(this.props.gamingSession.category)}
          heightRatio={0.5}
          topGradientTransparency={"rgba(0,0,0,0.3)"}
          middleGradientTransparency={"rgba(0,0,0,0.1)"}
          bottomGradientTransparency={"rgba(0,0,0,0.6)"}
        >
          <NavigationBar
            back="Games"
            type="transparent"
            {...{ navigation, rightAction, rightAction2 }}
          />
        </Header>
        <GamingSessionIconBar
          startTime={this.props.gamingSession.start_time}
          platform={this.props.gamingSession.platform}
          primaryUsersCount={this.props.gamingSession.primary_users_count}
          teamSize={this.props.gamingSession.team_size}
          lightLevel={this.props.gamingSession.light_level}
          sherpaLed={this.props.gamingSession.sherpa_led}
        />
        <Content>
          {this.props.gamingSession.name ? (
            <Card>
              <Panel text={this.props.gamingSession.name} numberOfLines={5} />
            </Card>
          ) : null}
          <Card>
            <PlayersList
              confirmedSessions={this.props.gamingSession.confirmed_sessions}
              navigation={this.props.navigation}
            />
          </Card>
          <Card
            onPress={() =>
              this.props.navigation.navigate("GamingSessionChat", {
                title: "Gaming Session Chat",
                room: room,
                url: url,
                allowAnon: true
              })
            }
          >
            <Text style={[styles.headline, styleSheet.typography["headline"]]}>
              Player Chat &raquo;
            </Text>
            <ChatPreview
              room={room}
              url={url}
              allowAnon={true}
              onOpenChat={() =>
                this.props.navigation.navigate("GamingSessionChat", {
                  title: "Gaming Session Chat",
                  room: room,
                  url: url,
                  allowAnon: true
                })
              }
            />
          </Card>
        </Content>
      </View>
    );
  }
}

// <View style={styles.buttons}>
//   <View style={styles.leftButton}>
//     <SketchButton
//       label="Join"
//       icon="restaurant"
//       onPress={this.goToRestaurant}
//       primary
//     />
//   </View>
//   <View style={styles.RightButton}>
//     <SketchButton
//       label="Leave"
//       icon="hotel"
//       onPress={this.goToHotels}
//       primary
//     />
//   </View>
// </View>

export function JoinLeaveButton(props) {
  if (props.hasJoined) {
    return (
      <CustomButton
        style={{
          height: 30,
          width: 180,
          marginBottom: 15
        }}
        title="Leave"
        onPress={() => props.leaveGame()}
      />
    );
  } else {
    return (
      <CustomButton
        style={{
          height: 30,
          width: 180,
          marginBottom: 15
        }}
        title="Join"
        onPress={() => props.joinGame()}
        onLongPress={() => props.onLongPress()}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttons: {
    flexDirection: "row",
    paddingTop: styleSheet.spacing.small,
    paddingHorizontal: styleSheet.spacing.small
  },
  leftButton: {
    flex: 1,
    marginRight: styleSheet.spacing.tiny
  },
  RightButton: {
    flex: 1
  }
});

const mapStateToProps = state => {
  const user = state.authentication.user;
  const gamingSessionLoading = state.gamingSessions.gamingSessionLoading;
  const gamingSession = state.gamingSessions.gamingSession;

  return {
    user,
    gamingSessionLoading,
    gamingSession
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSession));
