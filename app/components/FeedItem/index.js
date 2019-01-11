import React, { PureComponent } from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import TimeAgo from "../TimeAgo";
import moment from "moment";

import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import defaultImage from "../../assets/images/d2-all.jpg";
import Avatar from "../Avatar";
import Card from "../Card";

const NotificationCard = props => (
  <FeedCard item={props.item} navigation={props.navigation}>
    <Header item={props.item} />
    <FeedImage item={props.item} />
    <FeedBody item={props.item} />
    <Footer users={props.users} computedStyle={props.computedStyle} />
  </FeedCard>
);

const FeedCard = props => (
  <Card
    style={styles.card}
    onPress={() =>
      props.item.notification_type === "karma-received" ||
      props.item.notification_type === "username-mentioned" ||
      props.item.notification_type === "new-private-message"
        ? props.navigation.navigate("Friend", {
            userId: props.item.avatar_user_id
          })
        : props.navigation.navigate("GamingSession", {
            gamingSessionId: props.item.target_url_app.replace(/\D/g, "")
          })
    }
  >
    {props.children}
  </Card>
);

const Header = props => (
  <View style={styles.header}>
    <View style={styles.user}>
      <Avatar
        uri={
          !props.item.avatar_url ||
          props.item.avatar_url === "img/default-avatar.png"
            ? require("../../assets/images/default-avatar.png")
            : props.item.avatar_url
        }
      />

      <View style={styles.username}>
        <Text style={[styleSheet.typography["headline"]]}>
          {props.item.notification_type.replace("-", " ").replace("-", " ")}
        </Text>
        <Text style={[styleSheet.typography["footnote"]]}>
          <TimeAgo date={props.item.created_at} />
        </Text>
      </View>
    </View>
  </View>
);

const FeedImage = props =>
  props.item.notification_type === "player-joined-game" ? (
    <Image
      resizeMode="cover"
      style={[
        styles.image,
        {
          width: "100%"
        }
      ]}
      source={defaultImage}
    />
  ) : null;

const FeedBody = props => (
  <Text style={[styles.text, styleSheet.typography["body"]]}>
    {props.item.message}
  </Text>
);

const Footer = props => (
  <View style={styles.footer}>
    <View style={styles.comments}>
      {props.users.map((user, index) => (
        <Avatar
          key={user.id}
          uri={user.picture}
          stacked={!!index}
          style={props.computedStyle(index, props.users.length)}
        />
      ))}
    </View>
  </View>
);

export default class FeedItem extends PureComponent {
  render() {
    const users = [
      {
        id: 1,
        picture:
          "https://pwntastic-avatar-staging.s3.amazonaws.com/uploads/user/avatar/11863/main_mike.png"
      },
      {
        id: 2,
        picture:
          "https://www.gravatar.com/avatar/2898eac574ede99d396bd5d34fa1d8e4?s=200?d=404"
      }
    ];

    if (this.props.item.notification_type === "onboarding") {
      return <Text>Onboarding</Text>;
    }

    return (
      <View>
        <NotificationCard
          item={this.props.item}
          navigation={this.props.navigation}
          users={users}
          computedStyle={this.computedStyle}
        />
        {/* <FeedCard item={this.props.item} navigation={this.props.navigation}>
          <Header item={this.props.item} />
          <FeedImage item={this.props.item} />
          <FeedBody item={this.props.item} />
          <Footer users={users} computedStyle={this.computedStyle} />
        </FeedCard> */}
      </View>
    );
  }
  computedStyle(index: number, length: number) {
    const left = 2 === 0 ? 0 : -5 * (2 - 1) + styleSheet.spacing.tiny;

    return { left: 5 * (length - index - 1) };
  }
}
