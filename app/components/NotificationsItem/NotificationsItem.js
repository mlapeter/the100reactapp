import React, { PureComponent } from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import TimeAgo from "../TimeAgo";
import styles from "./styles";

export default class NotificationsItem extends PureComponent {
  render() {
    return (
      <TouchableHighlight
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
              })}
        underlayColor="white"
      >
        <View style={styles.box}>
          <View style={styles.leftBox}>
            <Image
              style={styles.avatarMini}
              source={
                this.props.item.avatar_url === null ||
                this.props.item.avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.png")
                  : { uri: this.props.item.avatar_url }
              }
            />
          </View>
          <View style={styles.middleBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.time}>
                {this.props.item.notification_type} -
              </Text>
              <TimeAgo style={styles.time} date={this.props.item.created_at} />
            </View>
            <Text style={styles.message}>{this.props.item.message}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
