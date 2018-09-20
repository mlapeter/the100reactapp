import React, { PureComponent } from "react";
import { Image, View, Text, TouchableHighlight } from "react-native";
import TimeAgo from "../TimeAgo";
import styles from "./styles";

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
              <Text type="headline" style={styles.headline} color={"black"}>
                {this.props.item.notification_type
                  .replace("-", " ")
                  .replace("-", " ")}
              </Text>
              <Text type="footnote" style={styles.footnote} color={"black"}>
                <TimeAgo date={this.props.item.created_at} />
              </Text>
            </View>
          </View>
          <Text type="footnote" />
        </View>
        <Text style={styles.text}>{this.props.item.message}</Text>
      </Card>

      // <View style={styles.box}>
      //   <View style={styles.leftBox}>
      //     <Image
      //       style={styles.avatarMini}
      //       source={
      //         this.props.item.avatar_url === null ||
      //         this.props.item.avatar_url === "img/default-avatar.png"
      //           ? require("../../assets/images/default-avatar.png")
      //           : { uri: this.props.item.avatar_url }
      //       }
      //     />
      //   </View>
      //   <View style={styles.middleBox}>
      //     <View style={{ flexDirection: "row" }}>
      //       <Text style={styles.time}>
      //         {this.props.item.notification_type} -
      //       </Text>
      //       <TimeAgo style={styles.time} date={this.props.item.created_at} />
      //     </View>
      //     <Text style={styles.message}>{this.props.item.message}</Text>
      //   </View>
      // </View>
      // </Card>
    );
  }
}
