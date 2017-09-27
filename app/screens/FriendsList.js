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
import { fetchFriends } from "../actions/friends";
import { connectAlert } from "../components/Alert";

class FriendsList extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    friendsError: PropTypes.string,
    isLoading: PropTypes.bool,
    items: PropTypes.array
  };
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.friendsError &&
      nextProps.friendsError !== this.props.friendsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.friendsError);
    }
  }

  fetchData() {
    this.props.dispatch(fetchFriends());
  }

  handleRefresh = () => {
    this.fetchData();
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      if (this.props.items.length < 1) {
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
      }
    }
    return (
      <View style={styles.container}>
        <Text>Friends</Text>
        <FlatList
          data={this.props.items}
          renderItem={({ item }) => (
            <Friend user={item} navigation={this.props.navigation} />
          )}
          keyExtractor={(item, index) => index}
          refreshing={this.props.isLoading}
          onRefresh={this.handleRefresh}
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

const mapStateToProps = state => {
  const items = state.friends.friends;
  const isLoading = state.friends.isLoading;

  return {
    items,
    isLoading,
    friendsError: state.friends.error
  };
};

export default connect(mapStateToProps)(connectAlert(FriendsList));
