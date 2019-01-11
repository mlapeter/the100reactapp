import React, { PureComponent } from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import TimeAgo from "../TimeAgo";
import moment from "moment";

import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import defaultImage from "../../assets/images/d2-all.jpg";
import Avatar from "../Avatar";
import Card from "../Card";

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
      <Card
        style={styles.card}
        onPress={() =>
          this.props.item.notification_type === "karma-received" ||
          this.props.item.notification_type === "username-mentioned" ||
          this.props.item.notification_type === "new-private-message"
            ? this.props.navigation.navigate("Friend", {
                userId: this.props.item.avatar_user_id
              })
            : this.props.navigation.navigate("GamingSession", {
                gamingSessionId: this.props.item.target_url_app.replace(
                  /\D/g,
                  ""
                )
              })
        }
      >
        <View style={styles.header}>
          <View style={styles.user}>
            <Avatar
              uri={
                !this.props.item.avatar_url ||
                this.props.item.avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.png")
                  : this.props.item.avatar_url
              }
            />

            <View style={styles.username}>
              <Text style={[styleSheet.typography["headline"]]}>
                {this.props.item.notification_type
                  .replace("-", " ")
                  .replace("-", " ")}
              </Text>
              <Text style={[styleSheet.typography["footnote"]]}>
                <TimeAgo date={this.props.item.created_at} />
              </Text>
            </View>
          </View>
        </View>
        {this.props.item.notification_type === "player-joined-game" ? (
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
        ) : null}
        <Text style={[styles.text, styleSheet.typography["body"]]}>
          {this.props.item.message}
        </Text>
        <View style={styles.footer}>
          <View style={styles.comments}>
            {users.map((user, index) => (
              <Avatar
                key={user.id}
                uri={user.picture}
                stacked={!!index}
                style={this.computedStyle(index, users.length)}
              />
            ))}
            {/* <Avatar
              key={0}
              uri={
                !this.props.item.avatar_url ||
                this.props.item.avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.png")
                  : this.props.item.avatar_url
              }
              stacked={!!0}
              style={this.computedStyle(0, 2)}
            />
            <Avatar
              key={1}
              uri={
                !this.props.item.avatar_url ||
                this.props.item.avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.png")
                  : this.props.item.avatar_url
              }
              stacked={!!1}
              style={this.computedStyle(1, 2)}
            /> */}
          </View>
        </View>
      </Card>
    );
  }
  computedStyle(index: number, length: number) {
    const left = 2 === 0 ? 0 : -5 * (2 - 1) + styleSheet.spacing.tiny;

    const { showLabel } = this.props;
    if (showLabel) {
      return { left: -5 * index };
    }
    return { left: 5 * (length - index - 1) };
  }
}
