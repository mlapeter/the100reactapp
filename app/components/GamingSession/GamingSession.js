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
import PlayerList from "./PlayerList";
import { colors, fontSizes } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";

Moment.globalFormat = "h:mma";
Moment.globalLocale = "en";

export default class GamingSession extends React.Component {
  static navigationOptions = {
    title: "Gaming Sessions"
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
    return (
      fetch(
        "http://pwn-staging.herokuapp.com/api/v1/gaming_sessions/" +
          this.props.gamingSessionId +
          ".json"
      )
        // this.props.navigation.state.params.gamingSessionId +

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
        })
    );
  }

  render() {
    // const { params } = this.props.navigation.state;

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
          <Moment element={Text}>
            {this.state.dataSource.start_time.toString()}
          </Moment>{" "}
          {this.state.dataSource.category.toString()}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {this.state.dataSource.name.toString()}
        </Text>
        <PlayerList
          confirmedSessions={this.state.dataSource.confirmed_sessions}
        />
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
  playersBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 5,
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 6,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  rightBox: {
    flex: 1,
    padding: 2
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  title: {
    color: colors.grey,
    fontFamily: "Futura",
    fontSize: fontSizes.primary
  },
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  }
});
