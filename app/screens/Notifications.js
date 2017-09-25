import React, { PropTypes, PureComponent, Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { onAuthChange } from "../redux/modules/authentication";

import { colors, fontSizes } from "../../app/styles";
import Moment from "../../node_modules/react-moment";
import TimeAgo from "../../node_modules/react-native-timeago";

import { Container } from "../components/Container";

// export default () => (
//   <Container>
//     <StatusBar translucent={false} barStyle="light-content" />
//     <View />
//   </Container>
// );

class Notifications extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func
  };
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isAuthed: false,
      refreshing: false,
      items: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    // this.fetchData();
  }

  fetchData() {
    console.log("Fetching Notifications");
    AsyncStorage.getItem("id_token").then(token => {
      fetch(
        "http://pwn-staging.herokuapp.com/api/v2/users/11869/notifications",
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            isLoading: token === null,
            items: responseJson,
            refreshing: false
          });
        })
        .catch(error => {
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

  userLogout() {
    this.props.alertWithType("error", "Sorry!", "there was an error.");
    // try {
    //   AsyncStorage.removeItem("id_token");
    // } catch (error) {
    //   console.log("AsyncStorage error: " + error.message);
    // }
    // this.props.dispatch(onAuthChange(""));

    // this.props.dispatch(onAuthChange());
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={this.fetchData}
          >
            <Text style={styles.buttonText}>
              {" "}
              Get Notifications (if logged in)
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={this.userLogout.bind(this)}
        >
          <Text style={styles.buttonText}> Log out </Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.items}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item, index) => index}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
      </View>
    );
  }
}

class ListItem extends PureComponent {
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Image
            style={styles.avatarMini}
            source={
              this.props.item.avatar_url === null
                ? require("../../app/images/default-avatar.png")
                : { uri: this.props.item.avatar_url }
            }
          />
        </View>
        <View style={styles.middleBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.time}>
              {this.props.item.notification_type} -
            </Text>
            <Text style={styles.time}>
              <TimeAgo time={this.props.item.created_at} minPeriod="60" />
            </Text>
          </View>
          <Text style={styles.username}>{this.props.item.message}</Text>
        </View>
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
  },
  box: {
    flexDirection: "row",
    margin: 5,
    padding: 5
  },
  input: {
    flexDirection: "row",
    alignItems: "stretch",
    margin: 5,
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da"
  },
  buttonWrapper: {
    padding: 10
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 7,
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
  username: {
    color: colors.grey,
    fontFamily: "Futura",
    fontSize: fontSizes.secondary
  },
  time: {
    padding: 3,
    color: colors.lightestGrey,
    fontSize: fontSizes.small
  },
  text: {
    color: colors.mediumGrey
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});

function mapStateToProps({ authentication }) {
  return {
    isAuthenticating: authentication.isAuthenticating,
    isAuthed: authentication.isAuthed
  };
}

// export default connect(mapStateToProps)(Notifications);
export default connectAlert(Notifications);
