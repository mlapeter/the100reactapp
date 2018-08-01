import React, { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { connect } from "react-redux";
import { colors, fontSizes } from "../styles";
import Moment from "../../node_modules/react-moment";
import Friend from "../components/Friend/Friend";
import Tabs from "../components/Tabs/Tabs";
import TopNav from "../components/TopNav/TopNav";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  fetchFriends,
  loadMoreFriends,
  refreshFriends,
  fetchGroupMembers,
  loadMoreGroupMembers,
  refreshGroupMembers,
  fetchPendingFriends,
  loadMorePendingFriends,
  refreshPendingFriends
} from "../actions/users";

import { connectAlert } from "../components/Alert";

class FriendsList extends Component {
  state = {
    searchText: "",
    searchResults: []
  };

  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    friendsError: PropTypes.string,
    isLoadingFriends: PropTypes.bool,
    isLoadingGroupMembers: PropTypes.bool,
    isLoadingPendingFriends: PropTypes.bool,
    friends: PropTypes.array,
    refreshing: PropTypes.bool,
    moreFriendsAvailable: PropTypes.bool,
    moreGroupMembersAvailable: PropTypes.bool,
    friends: PropTypes.array,
    groupMembers: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  // static navigationOptions = {
  //   header: null
  // };

  componentWillMount() {
    this.fetchAllData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.friendsError &&
      nextProps.friendsError !== this.props.friendsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.friendsError);
    }
  }

  setSearchText(text) {
    this.setState({
      searchText: text
    });
    this.setState({
      searchResults: this.filterUsers(text)
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  filterUsers(searchText) {
    function remove_duplicates_es6(arr) {
      let s = new Set(arr);
      let it = s.values();
      return Array.from(it);
    }

    allUsers = this.props.friends.concat(this.props.groupMembers);
    // not removing duplicates currently
    var users = [...new Set(allUsers)];
    let text = searchText.toLowerCase();
    let result = users.filter(user => {
      return text !== "" && user.gamertag.toLowerCase().search(text) !== -1;
    });
    return result;
  }

  fetchAllData = () => {
    this.props.dispatch(fetchFriends());
    this.props.dispatch(fetchGroupMembers());
    this.props.dispatch(fetchPendingFriends());
  };

  refreshFriends = () => {
    console.log("refreshFriends triggered");
    this.props.dispatch(refreshFriends());
  };

  loadMoreFriends = () => {
    console.log("loadMoreFriends triggered");
    if (
      this.props.moreFriendsAvailable === true &&
      this.props.isLoadingFriends === false
    ) {
      this.props.dispatch(loadMoreFriends());
    }
  };

  refreshGroupMembers = () => {
    this.props.dispatch(refreshGroupMembers());
  };

  loadMoreGroupMembers = () => {
    if (
      this.props.isLoadingGroupMembers === false &&
      this.props.moreGroupMembersAvailable === true
    ) {
      this.props.dispatch(loadMoreGroupMembers());
    }
  };

  refreshPendingFriends = () => {
    this.props.dispatch(refreshPendingFriends());
  };

  loadMorePendingFriends = () => {
    if (
      this.props.isLoadingPendingFriends === false &&
      this.props.morePendingFriendsAvailable === true
    ) {
      this.props.dispatch(loadMorePendingFriends());
    }
  };

  renderFooter = () => {
    if (!this.props.moreFriendsAvailable) {
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

  renderPendingFriendsFooter = () => {
    if (!this.props.morePendingFriendsAvailable) {
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
    // if (this.props.isLoading) {
    //   return (
    //     <View style={styles.container}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <TopNav
            showSearch={true}
            setSearchText={text => this.setSearchText(text)}
            searchText={this.state.searchText}
            user={this.props.user}
            navigation={this.props.navigation}
            // style={{ flex: 1 }}
          />
        </TouchableWithoutFeedback>

        <View Style={styles.searchResults}>
          <FlatList
            data={this.state.searchResults}
            renderItem={({ item }) => (
              <Friend user={item} navigation={this.props.navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props}
            onEndReachedThreshold={0}
          />
        </View>
        <Tabs>
          <View title="MY FRIENDS" style={styles.content}>
            <FlatList
              data={this.props.friends}
              renderItem={({ item }) => (
                <Friend user={item} navigation={this.props.navigation} />
              )}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.props}
              ListFooterComponent={this.renderFooter}
              refreshing={this.props.isLoadingFriends}
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
              keyExtractor={(item, index) => index.toString()}
              extraData={this.props}
              ListFooterComponent={this.renderGroupFooter}
              refreshing={this.props.isLoadingGroupMembers}
              onRefresh={this.refreshGroupMembers}
              onEndReached={this.loadMoreGroupMembers}
              onEndReachedThreshold={0}
            />
          </View>
          <View title="PENDING" style={styles.content}>
            <FlatList
              data={this.props.pendingFriends}
              renderItem={({ item }) => (
                <Friend user={item} navigation={this.props.navigation} />
              )}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.props}
              ListFooterComponent={this.renderPendingFriendsFooter}
              refreshing={this.props.isLoadingPendingFriends}
              onRefresh={this.refreshPendingFriends}
              onEndReached={this.loadMorePendingFriends}
              onEndReachedThreshold={0}
            />
          </View>
        </Tabs>
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
    // paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  // container: {
  //   padding: 5,
  //   paddingTop: 30,
  //   margin: 3,
  //   flex: 1,
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   backgroundColor: colors.white,
  //   flex: 1
  // },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  searchResults: {
    flex: 1
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
  const isLoadingFriends = state.users.isLoadingFriends;

  const groupMembers = state.users.groupMembers;
  const moreGroupMembersAvailable = state.users.moreGroupMembersAvailable;
  const isLoadingGroupMembers = state.users.isLoadingGroupMembers;

  const pendingFriends = state.users.pendingFriends;
  const morePendingFriendsAvailable = state.users.morePendingFriendsAvailable;
  const isLoadingPendingFriends = state.users.isLoadingPendingFriends;

  const user = state.authentication.user;

  return {
    isLoadingFriends,
    isLoadingGroupMembers,
    isLoadingPendingFriends,
    refreshing,
    friends,
    moreFriendsAvailable,
    pendingFriends,
    morePendingFriendsAvailable,
    groupMembers,
    moreGroupMembersAvailable,
    friendsError: state.users.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(FriendsList));
