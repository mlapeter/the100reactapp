import React, { Component, PropTypes, PureComponent } from "react";
import {
  ActivityIndicator,
  Alert,
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
import GamingSession from "./GamingSession";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

export default class GamingSessionsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      page: 1,
      error: null,
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
    console.log("Fetching Games Page: " + this.state.page);
    return fetch(
      "https://the100.io/api/v2/gaming_sessions?page=" + this.state.page
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          refreshing: false,
          data:
            this.state.page === 1
              ? responseJson
              : [...this.state.data, ...responseJson],
          error: responseJson.error || null
        });
      })
      .catch(error => {
        this.setState({ error, loading: false, refreshing: false });
        console.log("Error Fetching Games");
      });
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
        refreshing: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  renderFooter = () => {
    if (!this.state.refreshing) {
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator />
      </View>
    );
  };

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
        <FlatList
          data={this.state.data}
          renderItem={({ item }) =>
            <GamingSession data={item} navigation={this.props.navigation} />}
          ListHeaderComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          keyExtractor={item => item.id}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
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
  alertView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  alertText: {
    fontSize: fontSizes.large,
    fontWeight: "bold",
    paddingTop: 5
  },

  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
});
