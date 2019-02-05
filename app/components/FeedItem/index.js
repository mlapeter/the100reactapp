import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { connectAlert } from "../Alert";
import { connect } from "react-redux";
import styles from "./styles";
import Card from "../Card";
import FeedImage from "../FeedImage";
import { Header } from "./Header";
import { FeedBody } from "./FeedBody";
import Footer from "./Footer";

class FeedItem extends PureComponent {
  render() {
    if (this.props.item.item_type) {
      console.log("----- ITEM -------");
      console.log(this.props.item.item_type);
      console.log(this.props.item.author_gamertag);
      console.log(this.props.item.avatar_urls);
      console.log(this.props.item.related_users);

      return (
        <FeedCard
          navigation={this.props.navigation}
          item={this.props.item}
          computedStyle={this.computedStyle}
          currentUser={this.props.user}
        />
      );
    } else {
      return <Text>{this.props.item.item_type}</Text>;
    }
  }
}

const FeedCard = props => {
  let navigateTo = null;
  if (props.item.data && props.item.data["group_id"]) {
    navigateTo = () =>
      props.navigation.navigate("Group", {
        gamingSessionId: props.item.data["group_id"]
      });
  } else if (props.item.data && props.item.data["gaming_session_id"]) {
    navigateTo = () =>
      props.navigation.navigate("GamingSession", {
        gamingSessionId: props.item.data["gaming_session_id"]
      });
  } else if (props.item.data && props.item.data["user_id"]) {
    navigateTo = () =>
      props.navigation.navigate("Friend", {
        userId: props.item.author_user_id
      });
  }
  return (
    <Card
      style={styles.card}
      item={props.item}
      navigation={props.navigation}
      onPress={navigateTo}
    >
      <Header item={props.item} />
      <FeedImage item={props.item} />
      <FeedBody item={props.item} />
      <Footer
        users={props.item.related_users}
        computedStyle={props.computedStyle}
        item={props.item}
        currentUser={props.currentUser}
        navigation={props.navigation}
      />
    </Card>
  );
};

const mapStateToProps = state => {
  const user = state.users.currentUser;

  return {
    user
  };
};

export default connect(mapStateToProps)(connectAlert(FeedItem));
