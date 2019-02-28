import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  AsyncStorage,
  LayoutAnimation,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  View,
  Vibration
} from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";
import Sentry from "sentry-expo";
import { StoreReview } from "expo";

import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import {
  fetchGamingSession,
  fetchMyGamingSessions,
  fetchGroupGamingSessions
} from "../actions/gamingSessions";
import ChatPreview from "../components/ChatPreview";
import Panel from "../components/Panel/Panel";
import PlayersList from "../components/PlayersList";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import GamingSessionIconBar from "../components/GamingSessionIconBar";
import GroupsList from "../components/GroupsList";
import { fetchBungieImage } from "../utils/destinyActivities";

class GamingSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reserveButtonVisible: false,
      isLoading: true,
      gamingSessionErrorAt: null
    };
    gamingSessionId = this.props.navigation.state.params.gamingSessionId;
  }

  componentWillMount() {
    this.loadingTimer = setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 800);
  }

  componentWillUnmount() {
    console.log("UNMOUNTING GAMING SESSION");
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
    if (this.reviewTimer) {
      clearTimeout(this.reviewTimer);
    }
  }

  componentDidMount() {
    this.fetchGamingSessionData();
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Gaming Session"))
      .catch(e => console.log(e.message));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gamingSessionsError &&
      nextProps.gamingSessionsErrorAt !== this.props.gamingSessionsErrorAt
    ) {
      this.props.navigation.navigate("GamingSessionsList");
      this.props.alertWithType("error", "Error", nextProps.gamingSessionsError);
    }
  }

  fetchGamingSessionData() {
    this.props.dispatch(fetchGamingSession(gamingSessionId));
  }

  checkAndDisplayReviewRequest = async () => {

    if (StoreReview.isSupported()) {
      console.log("Displaying store review popup on ios");
      StoreReview.requestReview();
    } else {
      let askedForReview = await AsyncStorage.getItem("asked_for_review")
      if (!askedForReview) {
        Alert.alert(
          'Game Joined!',
          'Would you mind leaving us a quick rating?',
          [
            { text: "Never", onPress: () => { AsyncStorage.setItem("asked_for_review", true) } },
            {
              text: 'Not Now',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Sure!', onPress: () => {
                Linking.openURL("market://details?id=io.the100.mobile")
                AsyncStorage.setItem("asked_for_review", true)
              }
            },
          ],
          { cancelable: true },
        );
      }
    }
  };

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

  async postData(action) {
    this.setState({
      isLoading: true
    });

    try {
      let token = await AsyncStorage.getItem("id_token")

      let response = await fetch(
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

      let responseJson = await response.json();
      console.log(responseJson)
      this.props.dispatch(fetchMyGamingSessions());
      this.props.dispatch(fetchGroupGamingSessions());
      this.setState({
        isLoading: false
      });
      if (action === "/join" || action === "/join?join_as_reserve=true") {
        this.fetchGamingSessionData();
        this.reviewTimer = setTimeout(() => {
          this.checkAndDisplayReviewRequest();
        }, 2500);
      } else {
        this.props.navigation.navigate("GamingSessionsList");
      }

    } catch (error) {
      console.log("Gaming Session Post Error: ", error);
      Sentry.captureMessage("Gaming Session Post Error: ", error);
    };
  }

  // postData(action) {
  //   this.setState({
  //     isLoading: true
  //   });
  //   AsyncStorage.getItem("id_token")
  //     .then(token => {
  //       fetch(
  //         Environment["API_BASE_URL"] +
  //         Environment["API_VERSION"] +
  //         "gaming_sessions/" +
  //         gamingSessionId +
  //         action,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + token
  //           }
  //         }
  //       )
  //         .then(response => response.json())
  //         .then(responseJson => {
  //           if (action === "/join" || action === "/join?join_as_reserve=true") {
  //             this.fetchGamingSessionData();
  //             this.checkAndDisplayReviewRequest();
  //           } else {
  //             this.props.navigation.navigate("GamingSessionsList");
  //           }
  //           this.updateTimer = setTimeout(() => {
  //             this.props.dispatch(fetchMyGamingSessions());
  //             this.props.dispatch(fetchGroupGamingSessions());
  //             this.setState({
  //               isLoading: false
  //             });
  //           }, 300);
  //         })
  //         .catch(error => {
  //           console.log("Gaming Session Post Error: ", error);
  //           Sentry.captureMessage("Gaming Session Post Error: ", error);
  //         });
  //     })
  //     .catch(error => {
  //       console.log("Gaming Session Post Error: ", error);
  //       Sentry.captureMessage("Gaming Session Post Error: ", error);
  //     });
  // }


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
      !this.props.gamingSession ||
      !this.props.gamingSession.confirmed_sessions ||
      !this.props.user
    ) {
      return (
        <View style={styles.container}>
          <Header
            title={"..."}
            picture={"img/default-gaming-session-header.jpg"}
            heightRatio={0.5}
            topGradientTransparency={"rgba(0,0,0,0.9)"}
            middleGradientTransparency={"rgba(0,0,0,0.9)"}
            bottomGradientTransparency={"rgba(0,0,0,0.9)"}
          >
            <NavigationBar back="Back" type="transparent" {...{ navigation }} />
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
          size: 24,
          onPress: () => {
            this.onShare();
          }
        };
    const rightAction2 = userIds.includes(this.props.user.id)
      ? {
        icon: "cancel",
        text: "Leave",
        size: 24,
        onPress: () => {
          this.leaveGame();
        }
      }
      : {
        icon: "outline-person_add-24px",
        text: "Join",
        size: 24,
        onPress: () => {
          this.joinGame();
        },
        onLongPress: () => {
          this.onLongPress();
        }
      };
    const rightAction3 =
      userIds.includes(this.props.user.id) &&
        this.props.user.id === this.props.gamingSession.creator_id
        ? {
          icon: "edit",
          text: "Edit",
          size: 24,
          onPress: () => {
            this.props.navigation.navigate({
              routeName: "GamingSessionVisibility",
              params: {
                gamingSessionId: this.props.gamingSession.id
              },
              key: "gamingSessionVisibility-" + this.props.gamingSession.id
            });
          }
        }
        : this.state.reserveButtonVisible === true
          ? {
            icon: "outline-person_add-24px",
            text: "Join as Reserve",
            size: 24,
            onPress: () => {
              this.joinGameAsReserve();
            },
            onLongPress: () => {
              this.onLongPress();
            }
          }
          : userIds.includes(this.props.user.id)
            ? null
            : {
              icon: "more-horiz",
              size: 24,
              onPress: () => {
                this.onLongPress();
              },
              onLongPress: () => {
                this.onLongPress();
              }
            };

    let room = `game-${this.props.gamingSession.id}`;
    let url = `chat/gaming_sessions/${room}`;

    return (
      <View style={styles.container}>
        <Header
          title={this.props.gamingSession.category}
          picture={this.props.gamingSession.computed_image ? this.props.gamingSession.computed_image : "img/default-gaming-session-header.jpg"}
          heightRatio={0.5}
          topGradientTransparency={"rgba(0,0,0,0.4)"}
          middleGradientTransparency={"rgba(0,0,0,0.1)"}
          bottomGradientTransparency={"rgba(0,0,0,0.6)"}
        >
          <NavigationBar
            back="Back"
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
              platform={this.props.gamingSession.platform}
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
          {!this.props.gamingSession.group_id ||
            !this.props.gamingSession.group ? null : (
              <GroupsList
                groups={[this.props.gamingSession.group]}
                navigation={this.props.navigation}
              />
            )}
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
  const user = state.users.currentUser;
  const gamingSessionLoading = state.gamingSessions.gamingSessionLoading;
  const gamingSession = state.gamingSessions.gamingSession;
  const gamingSessionsError = state.gamingSessions.error;
  const gamingSessionsErrorAt = state.gamingSessions.errorAt;

  return {
    user,
    gamingSessionLoading,
    gamingSession,
    gamingSessionsError,
    gamingSessionsErrorAt
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSession));
