import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import PreSplash from "../../components/PreSplash/PreSplash";
import Chat from "../../components/Chat/Chat";

import PlayerList from "./PlayerList";
import { colors, fontSizes } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export default class GamingSession extends React.Component {
  static navigationOptions = {
    title: "Game"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      gameData: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return fetch(
      "https://www.the100.io/api/v1/gaming_sessions/" +
        this.props.navigation.state.params.gamingSessionId
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: responseJson
        });
        return responseJson;
      })
      .catch(error => {
        console.error(error);
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
        <Text style={styles.title}>
          {this.state.dataSource.category.toString()}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {this.state.dataSource.name != null ? (
            this.state.dataSource.name.toString()
          ) : (
            ""
          )}
        </Text>
        <View style={styles.iconBar}>
          <Text style={styles.icon}>
            <MaterialCommunityIcons
              name="calendar"
              size={14}
              color={colors.grey}
            />
            <Moment element={Text}>
              {this.state.dataSource.start_time.toString()}
            </Moment>
          </Text>
          <Text style={styles.icon}>
            <MaterialCommunityIcons name="xbox" size={14} color={colors.grey} />
            XBOX
          </Text>
          <Text style={styles.icon}>
            <MaterialCommunityIcons
              name="account"
              size={14}
              color={colors.grey}
            />
            2/4
          </Text>
          <Text style={styles.icon}>
            <MaterialCommunityIcons
              name="gauge"
              size={14}
              color={colors.grey}
            />
            400+
          </Text>
          <Text style={styles.icon}>
            <MaterialCommunityIcons
              name="security"
              size={14}
              color={colors.grey}
            />
            Sherpa-Led
          </Text>
        </View>
        <PlayerList
          confirmedSessions={this.state.dataSource.confirmed_sessions}
        />
        <Chat chatroom={"help_chatroom"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
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
  title: {
    padding: 5,
    color: colors.grey,
    //fontFamily: "Futura",
    fontSize: fontSizes.primary
  },
  description: {
    padding: 5,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  }
});
