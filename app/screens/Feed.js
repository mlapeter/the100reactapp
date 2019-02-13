import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AndroidBackHandler } from "react-navigation-backhandler";


import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchFeed, loadMoreFeedItems } from "../actions/feed";

import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import TopNav from "../components/TopNav/TopNav";
import FeedItem from "../components/FeedItem";

import defaultGroupHeaderBackground from "../assets/images/d2-all.jpg";
import hunterHeader from "../assets/images/d2-hunter.jpg";
import titanHeader from "../assets/images/d2-titan.jpg";
import warlockHeader from "../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../assets/images/bungie-placeholder.jpg";

class Feed extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch(fetchFeed());
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics.hit(new PageHit("App - Feed")).catch(e => console.log(e.message));
  }

  componentWillUnmount() {
    console.log("Unmounting Feed");
  }

  onBackButtonPressAndroid = () => {
    this.props.dispatch(fetchFeed());
    return true;
  };

  refresh = () => {
    this.flatList.scrollToOffset({ x: 0, y: 0, animated: true })
    this.props.dispatch(fetchFeed());
  }

  navigateTo = (item) => {
    if (item.item_type && item.item_type == "gaming-session-deleted") {
      // Nothing to link to 
    } else if (item.data && item.data["group_id"]) {
      this.props.navigation.navigate("Group", {
        groupId: item.data["group_id"]
      });
    } else if (item.data && item.data["gaming_session_id"]) {
      this.props.navigation.navigate("GamingSession", {
        gamingSessionId: item.data["gaming_session_id"]
      });
    } else if (item.data && item.data["user_id"]) {
      this.props.navigation.navigate("Friend", {
        userId: item.author_user_id
      });
    }
  }

  likeable(item) {
    const likeableItems = ["user-generated", "moment", "first-member-game", "player-joined-game", "new-group-member", "first-member-game", "group-announcement", "game-announcement", "gaming-session-announcement", "global-announcement"]
    if (likeableItems.includes(item.item_type) && item.related_users) {
      return true
    } else {
      return false
    }
  }

  iframeSrc(item) {
    if (item.body && item.body.includes("iframe")) {
      if (item.body.match('src="(.*?)" ')) {
        return String(item.body.match('src="(.*?)" ').pop());
      }
    } else if (item.body && !item.body.includes("iframe") && item.body.includes("xboxdvr.com")) {
      return item.body;
    } else {
      return null
    }
  }

  iframeHeight(item) {
    if (item.body && item.body.includes("iframe") && item.body.match('height="(.*?)" ')) {
      return Number(item.body.match('height="(.*?)" ').pop());
    } else if (item.body && !item.body.includes("iframe") && item.body.includes("xboxdvr.com")) {
      return 260
    } else {
      return 300
    }
  }

  computedImageUrl(item) {
    if (item.image_url) {
      return this.computedPicture(item.image_url)
    } else {
      return null
    }
  }

  computedPicture(url) {
    if (url === "https://www.the100.io/d2-all.jpg") {
      return defaultGroupHeaderBackground;
    } else if (url === "img/default-gaming-session-header.jpg") {
      return defaultGamingSessionHeaderBackground;
    } else if (url === "https://www.the100.io/d2-hunter.jpg") {
      return hunterHeader;
    } else if (url === "https://www.the100.io/d2-titan.jpg") {
      return titanHeader;
    } else if (url === "https://www.the100.io/d2-warlock.jpg") {
      return warlockHeader;
    } else {
      return { uri: url };
    }
  }

  loadMore = () => {
    console.log("loadMore triggered");
    console.log(
      "this.props.moreFeedItemsAvailable: ",
      this.props.moreFeedItemsAvailable
    );
    console.log("this.props.isLoading ", this.props.isLoading);
    if (
      this.props.moreFeedItemsAvailable === true &&
      this.props.isLoading === false
    ) {
      console.log("loadMore fully triggered");

      this.props.dispatch(loadMoreFeedItems());
    }
  };

  refreshButton = () => {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator size={"small"} style={{ padding: 4 }} />
      )
    } else {
      return (
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() =>
            this.refresh()
          }
        >
          <MaterialIcons
            name="refresh"
            size={24}
            style={{
              color: colors.lightGray
            }}
          />
        </TouchableOpacity>
      )
    }
  }

  renderFooter = () => {
    if (!this.props.isLoading && !this.props.moreFeedItemsAvailable) {
      return (
        <View style={styles.container}>
          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={colors.mediumGrey}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.footer}>
            <ActivityIndicator style={{ padding: 30 }} />
          </View>
        </View>
      );
    }
  };

  render() {
    console.log("RENDERING FEED SCREEN")
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>

        <View style={styles.container}>

          <TopNav
            title="Feed"
            user={this.props.user}
            navigation={this.props.navigation}
            refreshButton={this.refreshButton}
          />
          <FlatList
            ref={(f) => { this.flatList = f }}
            data={this.props.feedItems}
            renderItem={({ item }) => (
              <FeedItem
                item={item}
                user={this.props.user}
                likeable={this.likeable(item)}
                imageUrl={this.computedImageUrl(item)}
                iframeSrc={this.iframeSrc(item)}
                iframeHeight={this.iframeHeight(item)}
                navigation={this.props.navigation}
                navigateTo={this.navigateTo}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.props.isLoading}
            onRefresh={() => this.props.dispatch(fetchFeed())}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0}
            initialNumToRender={5}
          />
        </View>
      </AndroidBackHandler>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: styleSheet.spacing.small,
    backgroundColor: colors.lightGray
  },
  footer: {
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  const user = state.users.currentUser;
  const feedItems = state.feed.feedItems;
  const isLoading = state.feed.isLoading;
  const moreFeedItemsAvailable = state.feed.moreFeedItemsAvailable;

  return {
    user,
    feedItems,
    isLoading,
    moreFeedItemsAvailable
  };
};

export default connect(mapStateToProps)(connectAlert(Feed));
