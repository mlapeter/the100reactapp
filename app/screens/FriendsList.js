import React, { PropTypes, PureComponent, Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { connect } from "react-redux";
import { colors, fontSizes } from "../styles";
import Moment from "../../node_modules/react-moment";
import TimeAgo from "../../node_modules/react-native-timeago";
import Friend from "../components/Friend/Friend";
import Tabs from "../components/Tabs/Tabs";
import TopNav from "../components/TopNav/TopNav";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { fetchFriends } from "../actions/users";
import { loadMoreFriends } from "../actions/users";
import { changeFriendsPage } from "../actions/users";
import { refreshFriends } from "../actions/users";

import { fetchGroupMembers } from "../actions/users";
import { loadMoreGroupMembers } from "../actions/users";
import { refreshGroupMembers } from "../actions/users";

import { connectAlert } from "../components/Alert";

class FriendsList extends Component {
  static navigationOptions = {
    header: null,
    title: "test"
  };

  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    friendsError: PropTypes.string,
    isLoading: PropTypes.bool,
    friends: PropTypes.array,
    isLoading: PropTypes.bool,
    refreshing: PropTypes.bool,
    moreFriendsAvailable: PropTypes.bool,
    moreGroupMembersAvailable: PropTypes.bool,
    friends: PropTypes.array,
    groupMembers: PropTypes.array
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
    this.props.dispatch(fetchGroupMembers());
  }

  refreshFriends = () => {
    // this.fetchData();
    console.log("refreshFriends Triggered");
    this.props.dispatch(refreshFriends());
  };

  loadMoreFriends = () => {
    console.log("LoadMoreFriends Triggered");
    if (
      this.props.refreshing === false &&
      this.props.moreFriendsAvailable === true
    ) {
      console.log("LoadMoreFriends Activated");
      this.props.dispatch(loadMoreFriends());
    }
  };

  refreshGroupMembers = () => {
    console.log("refreshGroupMembers Triggered");
    this.props.dispatch(refreshGroupMembers());
  };

  loadMoreGroupMembers = () => {
    console.log("loadMoreGroupMembers Triggered");
    if (
      this.props.refreshing === false &&
      this.props.moreGroupMembersAvailable === true
    ) {
      console.log("loadMoreGroupMembers Activated");
      this.props.dispatch(loadMoreGroupMembers());
    }
  };

  renderFooter = () => {
    if (!this.props.moreFriendsAvailable) {
      console.log(
        "In Footer moreFriendsAvailable: " + this.props.moreFriendsAvailable
      );
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  renderGroupFooter = () => {
    if (!this.props.moreGroupMembersAvailable) {
      console.log(
        "In Footer moreGroupMembersAvailable: " +
          this.props.moreGroupMembersAvailable
      );
      console.log(
        "In Footer moreGroupMembersAvailable: " +
          this.props.moreGroupMembersAvailable
      );
      return (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumGrey}
          />
        </View>
      );
    } else {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      // if (this.props.friends.length < 1) {
      //   return (
      //     <View style={styles.container}>
      //       <TouchableOpacity
      //         style={styles.buttonWrapper}
      //         onPress={this.fetchData}
      //       >
      //         <Text style={styles.buttonText}> Get Friends</Text>
      //       </TouchableOpacity>
      //     </View>
      //   );
      // }
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <TopNav user={this.props.user} style={{ flex: 1 }} />
          <Tabs>
            <View title="MY FRIENDS" style={styles.content}>
              <FlatList
                data={this.props.friends}
                renderItem={({ item }) => (
                  <Friend user={item} navigation={this.props.navigation} />
                )}
                keyExtractor={(item, index) => index}
                extraData={this.props}
                ListFooterComponent={this.renderFooter}
                refreshing={this.props.isLoading}
                onRefresh={this.refreshFriends}
                onEndReached={this.loadMoreFriends}
                onEndReachedThreshold={0}
              />
            </View>
            <View title="MY GROUP" style={styles.content}>
              <FlatList
                data={this.props.groupMembers}
                renderItem={({ item }) => (
                  <Friend user={item} navigation={this.props.navigation} />
                )}
                keyExtractor={(item, index) => index}
                extraData={this.props}
                ListFooterComponent={this.renderGroupFooter}
                refreshing={this.props.isLoading}
                onRefresh={this.refreshGroupMembers}
                onEndReached={this.loadMoreGroupMembers}
                onEndReachedThreshold={0}
              />
            </View>
            <View title="RECENT" style={styles.content}>
              <Text>Coming Soon</Text>
            </View>
          </Tabs>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: colors.white,
    flex: 1
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: colors.white
  },
  alertView: {
    flexDirection: "row",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  const refreshing = state.users.refreshing;
  const friends = state.users.friends;
  const moreFriendsAvailable = state.users.moreFriendsAvailable;

  const groupMembers = state.users.groupMembers;
  const moreGroupMembersAvailable = state.users.moreGroupMembersAvailable;

  const isLoading = state.users.isLoading;
  const user = state.authentication.user;

  return {
    refreshing,
    friends,
    moreFriendsAvailable,
    groupMembers,
    moreGroupMembersAvailable,
    isLoading,
    friendsError: state.users.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(FriendsList));
