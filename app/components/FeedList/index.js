import * as React from "react";
import { FlatList, Image, View } from "react-native";
import ImageCard from "../ImageCard";
import defaultUserHeaderBackground from "../../assets/images/d2-all.jpg";

export default class FeedList extends React.Component {
  renderItem = ({ item }: Item) => (
    <Card
      onPress={() =>
        this.props.item.notification_type === "karma-received" ||
        this.props.item.notification_type === "username-mentioned" ||
        this.props.item.notification_type === "new-private-message"
          ? this.props.navigation.navigate("Friend", {
              userId: this.props.item.avatar_user_id
            })
          : this.props.navigation.navigate("GamingSession", {
              gamingSessionId: this.props.item.target_url_app.replace(/\D/g, "")
            })
      }
    >
      <View style={styles.header}>
        <View style={styles.user}>
          <Image
            style={styles.avatarMini}
            source={
              !this.props.item.avatar_url ||
              this.props.item.avatar_url === "img/default-avatar.png"
                ? require("../../assets/images/default-avatar.png")
                : { uri: this.props.item.avatar_url }
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
      <Text style={[styles.text, styleSheet.typography["summary"]]}>
        {this.props.item.message}
      </Text>
    </Card>
  );

  render() {
    return (
      <FlatList
        data={this.props.notifications}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={this.props.isLoading}
        onRefresh={this.handleRefresh}
        //   ListFooterComponent={this.renderFooter}
      />
    );
  }
}
