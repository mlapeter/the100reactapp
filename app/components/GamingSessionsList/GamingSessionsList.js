import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ListView,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { StackNavigator } from "react-navigation";

import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export default class GamingSessionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    };
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    console.log("FETCHING DATA");
    return fetch("https://www.the100.io/api/v1/gaming_sessions")
      .then(response => response.json())
      .then(responseJson => {
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState(
          {
            dataSource: ds.cloneWithRows(responseJson),
            isLoading: false
          },
          function() {
            // do something with new state
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={rowData =>
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("GamingSession", {
                  gamingSessionId: rowData.id
                })}
              underlayColor="white"
            >
              <View style={styles.box}>
                <View style={styles.leftBox}>
                  <Image
                    style={styles.avatarMini}
                    source={
                      rowData.game_avatar_url === "img/default-avatar.png"
                        ? require("../../images/default-avatar.png")
                        : { uri: rowData.game_avatar_url }
                    }
                  />
                </View>
                <View style={styles.middleBox}>
                  <Text style={styles.gamingSessionTitle}>
                    {rowData.category}
                  </Text>
                  <Text
                    style={styles.gamingSessionDescription}
                    numberOfLines={2}
                  >
                    {rowData.name}
                  </Text>
                </View>
                <View style={styles.rightBox}>
                  <Text style={styles.iconText}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={12}
                      color={colors.mediumGrey}
                    />
                    <Moment element={Text}>
                      {rowData.start_time}
                    </Moment>
                  </Text>
                  <Text style={styles.iconText}>
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color={colors.mediumGrey}
                    />{" "}
                    {rowData.primary_users_count}/{rowData.team_size}
                  </Text>
                  <Text style={styles.iconText}>
                    <MaterialCommunityIcons
                      name="gauge"
                      size={14}
                      color={colors.mediumGrey}
                    />
                    {rowData.light_level === null
                      ? " any"
                      : rowData.light_level}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>}
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
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
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
    flex: 1.1
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  gamingSessionTitle: {
    color: colors.grey,
    fontFamily: "Futura"
  },
  gamingSessionDescription: {
    color: colors.lightGrey
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});
