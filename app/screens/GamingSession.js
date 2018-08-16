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
import { colors, fontSizes, fontStyles } from "../styles";
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

    setTimeout(() => {
      this.props.dispatch(fetchGamingSessions());
      this.props.dispatch(fetchMyGamingSessions());
      this.props.dispatch(fetchGroupGamingSessions());
      this.setState({
        isLoading: false
      });
      this.props.navigation.navigate("GamingSessionsList");
    }, 1000);
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
            this.setState({
              isLoading: false
            });
          } else {
            console.log("GAME LEFT");
          }
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
        {this.state.reserveButtonVisible ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Button
              style={{
                height: 30,
                marginBottom: 15
              }}
              onPress={() => this.joinGameAsReserve()}
              title="Join As Reserve"
            />
          </View>
        ) : null}
        <View style={styles.titleBar}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {this.props.gamingSession.category != null
                ? this.props.gamingSession.category.toString()
                : ""}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            {this.props.user.user_id === this.props.gamingSession.creator_id ? (
              <View style={{ marginBottom: 10 }}>
                <Button
                  style={{
                    height: 25,
                    width: 180
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("GamingSessionEdit")}
                  title="Edit"
                />
              </View>
            ) : null}
            <JoinLeaveButton
              hasJoined={userIds.includes(this.props.user.user_id)}
              leaveGame={this.leaveGame.bind(this)}
              joinGame={this.joinGame}
              onLongPress={this.onLongPress}
            />

            <View style={{ marginTop: 10 }}>
              <Button
                style={{
                  height: 30,
                  width: 180,
                  marginBottom: 15
                }}
                onPress={() => this.onShare()}
                title="Share"
              />
            </View>
          </View>
        </View>
        {this.props.gamingSession.name != null ? (
          <Panel
            text={this.props.gamingSession.name.toString()}
            numberOfLines={3}
          />
        ) : null}

        <View style={styles.iconBar}>
          <TimeIcon startTime={this.props.gamingSession.start_time} />
          <PlatformIcon platform={this.props.gamingSession.platform} />
          <PlayerIcon
            primaryUsersCount={this.props.gamingSession.primary_users_count}
            teamSize={this.props.gamingSession.team_size}
          />
          <PowerIcon lightLevel={this.props.gamingSession.light_level} />
          <SherpaIcon sherpaLed={this.props.gamingSession.sherpa_led} />
        </View>
        <ScrollView>
          <Text style={styles.sectionHeader}>Players:</Text>
          <PlayersList
            confirmedSessions={this.props.gamingSession.confirmed_sessions}
            navigation={this.props.navigation}
          />
          <Text style={styles.sectionHeader}>Chat:</Text>
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
              })}
          />
        </ScrollView>
      </View>
    );
  }
}

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

function TimeIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />

      <Moment format="hh:mm A  MM/DD/YY" element={Text}>
        {props.startTime.toString()}
      </Moment>
    </Text>
  );
}

function PlayerIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.primaryUsersCount}/{props.teamSize}
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

function SherpaIcon(props) {
  if (props.sherpaLed) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="security" size={14} color={colors.grey} />
        Sherpa-Led
      </Text>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  keyboardView: {
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.grey
  },
  container: {
    padding: 5,
    paddingTop: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
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
    margin: 2,
    backgroundColor: colors.white
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5
  },

  title: {
    padding: 5,
    color: colors.grey,
    fontFamily: fontStyles.gameHeaderFont,
    fontSize: fontSizes.primary
  },
  description: {
    padding: 5,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  },
  sectionHeader: {
    marginTop: 8,
    marginHorizontal: 8,
    fontWeight: "bold"
  },
  titleContainer: {
    flex: 4,
    justifyContent: "center"
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
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
