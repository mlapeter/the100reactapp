import React, { PureComponent } from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import TimeAgo from "../TimeAgo";
import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

import Card from "../Card";

export default class NotificationsItem extends PureComponent {
  render() {
    return (
      <Card
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
            <Image
              style={styles.avatarMini}
              source={
                this.props.item.avatar_url === null ||
                this.props.item.avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.png")
                  : { uri: this.props.item.avatar_url }
              }
            />
            <View style={styles.username}>
              <Text
                style={[styles.headline, styleSheet.typography["headline"]]}
              >
                {this.props.item.notification_type
                  .replace("-", " ")
                  .replace("-", " ")}
              </Text>
              <Text
                style={[styles.footnote, styleSheet.typography["footnote"]]}
              >
                <TimeAgo date={this.props.item.created_at} />
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.text, styleSheet.typography["summary"]]}>
          {this.props.item.message}
        </Text>
      </Card>
    );
  }
}
