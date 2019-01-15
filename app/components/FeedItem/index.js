import React, { PureComponent } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import TimeAgo from "../TimeAgo";
import moment from "moment";

import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import defaultImage from "../../assets/images/d2-all.jpg";
import Avatar from "../Avatar";
import Card from "../Card";
import Icon from "../Icon";

const OnboardingCard = props => (
  <Card
    style={styles.card}
    item={props.item}
    navigation={props.navigation}
    onPress={() => props.navigation.navigate("Groups")}
  >
    <Header item={props.item} />
    <FeedImage item={props.item} />
    <FeedBody item={props.item} />
    <Footer
      users={props.users}
      computedStyle={props.computedStyle}
      feedButton={{
        icon: "star-border",
        text: "say hi!",
        size: 24,
        onPress: () => {
          null;
        }
      }}
    />
  </Card>
);
const NotificationCard = props => (
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
    <Header item={props.item} />
    <FeedImage item={props.item} />
    <FeedBody item={props.item} />
    <Footer users={props.users} computedStyle={props.computedStyle} />
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
        {props.item.gamertag ? (
          <Text style={[styleSheet.typography["footnote"]]}>
            @{props.item.gamertag}
          </Text>
        ) : null}
      </View>
    </View>
    <Text style={[styleSheet.typography["footnote"]]}>
      <TimeAgo date={props.item.created_at} />
    </Text>
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

const FeedButton = props => (
  <TouchableOpacity onPress={null} onLongPress={null}>
    <View style={styles.iconButton}>
      <Icon
        name={props.button.icon}
        color={colors.lightGrey}
        size={props.button.size}
      />
      <Text
        style={[
          { color: colors.lightGrey },
          styles.iconButtonText,
          styleSheet.typography["callout"]
        ]}
      >
        {props.button.text}
      </Text>
      )}
    </View>
  </TouchableOpacity>
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
    {props.feedButton && <FeedButton button={props.feedButton} />}
  </View>
);

export default class FeedItem extends PureComponent {
  render() {
    const onboardingItem = {
      avatar_url:
        "https://pwntastic-avatar-staging.s3.amazonaws.com/uploads/user/avatar/11863/main_mike.png",
      avatar_user_id: 11863,
      gamertag: "muhuhuhaha",
      created_at: "2018-11-23T13:31:20.115-08:00",
      group_id: null,
      id: 2962,
      message:
        "Welcome to Bravo Company 101! I'm @muhuhuhaha, your group moderator. Tap this post to view and join upcoming games, and chat with other group members.",
      notification_object_id: 24966,
      notification_type: "Hello!",
      read: false,
      sender_id: null,
      target_url: "/gaming_sessions/8803",
      target_url_app: "#/tab/user-gaming-sessions/8803",
      updated_at: "2018-11-23T13:31:20.115-08:00",
      user_id: 11869
    };

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
      return (
        <OnboardingCard
          navigation={this.props.navigation}
          item={onboardingItem}
          users={users}
          computedStyle={this.computedStyle}
        />
      );
    }

    return (
      <NotificationCard
        navigation={this.props.navigation}
        item={this.props.item}
        users={users}
        computedStyle={this.computedStyle}
      />
    );
  }
  computedStyle(index: number, length: number) {
    const left = 2 === 0 ? 0 : -5 * (2 - 1) + styleSheet.spacing.tiny;

    return { left: 5 * (length - index - 1) };
  }
}
