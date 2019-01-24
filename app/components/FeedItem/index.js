import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TimeAgo from "../TimeAgo";

import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Avatar from "../Avatar";
import Card from "../Card";
import Icon from "../Icon";
import FeedImage from "../FeedImage";
import MessageBody from "../Chat/Message/MessageBody";

export default class FeedItem extends PureComponent {
  render() {
    return (
      <FeedCard
        navigation={this.props.navigation}
        item={this.props.item}
        computedStyle={this.computedStyle}
      />
    );
  }
}

const FeedCard = props => {
  let feedButton = null;
  if (props.item.data && props.item.data["gaming_session_id"]) {
    feedButton = {
      icon: "outline-person_add-24px",
      text: "join",
      size: 22,
      onPress: () => {
        null;
      }
    };
  } else {
    feedButton = {
      icon: "star-border",
      text: "",
      size: 24,
      onPress: () => {
        null;
      }
    };
  }
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
        feedButton={feedButton}
      />
    </Card>
  );
};

const Header = props => (
  <View style={styles.header}>
    <View style={styles.user}>
      <Avatar
        uri={
          !props.item.author_avatar_url ||
          props.item.author_avatar_url === "img/default-avatar.png"
            ? "https://www.the100.io/default-avatar.png"
            : props.item.author_avatar_url
        }
      />

      <View style={styles.username}>
        <Text style={[styleSheet.typography["headline"]]}>
          {props.item.title}
        </Text>
        {props.item.author_gamertag ? (
          <Text style={[styleSheet.typography["footnote"]]}>
            @{props.item.author_gamertag}{" "}
            {props.item.title.length > 22 && (
              <TimeAgo date={props.item.created_at} />
            )}
          </Text>
        ) : null}
      </View>
    </View>
    {props.item.title.length < 22 ? (
      <Text style={[styleSheet.typography["footnote"]]}>
        <TimeAgo date={props.item.created_at} />
      </Text>
    ) : null}
  </View>
);

const FeedBody = props => (
  // <Text style={[styles.text, styleSheet.typography["body"]]}>
  //   {props.item.body}
  // </Text>
  <MessageBody
    text={props.item.body}
    style={[styles.text, styleSheet.typography["body"]]}
  />
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
    </View>
  </TouchableOpacity>
);

class Footer extends PureComponent {
  render() {
    return (
      <View style={styles.footer}>
        {this.props.users && this.props.users.avatar_urls.length > 1 ? (
          <View style={styles.comments}>
            {this.props.users.avatar_urls.map((user, index) => (
              <Avatar
                key={index}
                uri={user}
                stacked={!!index}
                style={this.computedStyle(
                  index,
                  this.props.users.avatar_urls.length
                )}
              />
            ))}
          </View>
        ) : (
          <View style={styles.comments} />
        )}
        {this.props.feedButton && <FeedButton button={this.props.feedButton} />}
      </View>
    );
  }
  computedStyle(index, length) {
    const left = 2 === 0 ? 0 : -5 * (2 - 1) + styleSheet.spacing.tiny;
    return { left: 5 * (length - index - 1) };
  }
}
