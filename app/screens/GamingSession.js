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
  View,
  Vibration
} from "react-native";
import Environment from "../config/environment";
import ChatPreview from "../components/ChatPreview";
import Panel from "../components/Panel/Panel";
import PlayersList from "../components/PlayersList/PlayersList";
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  fetchGamingSession,
  fetchMyGamingSessions,
  fetchGroupGamingSessions
} from "../actions/gamingSessions";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import GamingSessionIconBar from "../components/GamingSessionIconBar";
import destinyActivities from "../utils/destinyActivities.json";

class GamingSession extends React.Component {
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

  onLongPress = () => {
    Vibration.vibrate(20);
    this.setState({
      reserveButtonVisible: !this.state.reserveButtonVisible
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
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
          } else {
            this.props.navigation.navigate("GamingSessionsList");
          }
          setTimeout(() => {
            this.props.dispatch(fetchMyGamingSessions());
            this.props.dispatch(fetchGroupGamingSessions());
            this.setState({
              isLoading: false
            });
          }, 300);
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
            ? "Join my game: " +
              this.props.gamingSession.category.toString() +
              " " +
              "https://the100.io/game/" +
              this.props.gamingSession.id
            : "Join my game: " +
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

  render() {
    const { params } = this.props.navigation.state;
    const navigation = this.props.navigation;

    if (
      this.state.isLoading ||
      this.props.gamingSessionLoading ||
      !this.props.gamingSession.confirmed_sessions
    ) {
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
            <NavigationBar
              back="Games"
              type="transparent"
              {...{ navigation }}
            />
          </Header>
          <Content>
            <ActivityIndicator style={styles.loading} />
          </Content>
        </View>
      );
    }

    let userIds = [];
    this.props.gamingSession.confirmed_sessions.map(confirmedSession =>
      userIds.push(confirmedSession.user_id)
    );

    const rightAction =
      this.state.reserveButtonVisible === true
        ? null
        : {
            icon: "share",
            onPress: () => {
              this.onShare();
            }
          };
    const rightAction2 = userIds.includes(this.props.user.user_id)
      ? {
          icon: "cancel",
          text: "Leave",
          onPress: () => {
            this.leaveGame();
          }
        }
      : {
          icon: "outline-person_add-24px",
          text: "Join",
          onPress: () => {
            this.joinGame();
          },
          onLongPress: () => {
            this.onLongPress();
          }
        };
    const rightAction3 =
      this.state.reserveButtonVisible === true
        ? {
            icon: "outline-person_add-24px",
            text: "Join as Reserve",
            onPress: () => {
              this.joinGameAsReserve();
            },
            onLongPress: () => {
              this.onLongPress();
            }
          }
        : null;

    let room = `game-${this.props.gamingSession.id}`;
    let url = `chat/gaming_sessions/${room}`;

    return (
      <View style={styles.container}>
        <Header
          title={this.props.gamingSession.category}
          picture={this.fetchBungieImage(this.props.gamingSession.category)}
          heightRatio={0.5}
          topGradientTransparency={"rgba(0,0,0,0.4)"}
          middleGradientTransparency={"rgba(0,0,0,0.1)"}
          bottomGradientTransparency={"rgba(0,0,0,0.6)"}
        >
          <NavigationBar
            back="Games"
            type="transparent"
            {...{ navigation, rightAction, rightAction2, rightAction3 }}
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

const styles = StyleSheet.create({
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
