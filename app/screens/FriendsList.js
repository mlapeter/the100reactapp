import React, { PropTypes, PureComponent, Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { colors, fontSizes } from "../styles";
import Moment from "../../node_modules/react-moment";
import TimeAgo from "../../node_modules/react-native-timeago";
import Friend from "../components/Friend/Friend";

class Friends extends PureComponent {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      refreshing: false,
      items: null
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    // this.fetchData();
  }

  fetchData() {
    this.setState({
      isLoading: true
    });
    console.log("Fetching Friends");
    AsyncStorage.getItem("id_token").then(token => {
      fetch("https://pwn-staging.herokuapp.com/api/v2/users/11869/friends", {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      })
        .then(response => response.json())
        .catch(error => console.warn("fetch error:", error))
        .then(responseJson => {
          console.log("JSON received");
          this.setState({
            isLoading: false,
            items: responseJson
          });
          console.log(this.state.items);
        })
        .catch(error => {
          console.log("Error Fetching Friends!");
          console.error(error);
        });
    });
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.fetchData();
      }
    );
  };

  render() {
    if (this.state.isloading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!this.state.items) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={this.fetchData}
          >
            <Text style={styles.buttonText}> Get Friends</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Friends</Text>
          <FlatList
            data={this.state.items}
            renderItem={({ item }) => (
              <Friend user={item} navigation={this.props.navigation} />
            )}
            keyExtractor={(item, index) => index}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    paddingTop: 30,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
});

function mapStateToProps({ authentication }) {
  return {
    isAuthenticating: authentication.isAuthenticating,
    isAuthed: authentication.isAuthed
  };
}

export default connect(mapStateToProps)(Friends);
