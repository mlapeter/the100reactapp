import React, { PureComponent } from "react";
import { Image, View } from "react-native";
import styles from "./styles";
import { fetchBungieImage } from "../../utils/destinyActivities";
import defaultGroupHeaderBackground from "../../assets/images/d2-all.jpg";
import defaultUserHeaderBackground from "../../assets/images/d2-hunter.jpg";
import hunterHeader from "../../assets/images/d2-hunter.jpg";
import titanHeader from "../../assets/images/d2-titan.jpg";
import warlockHeader from "../../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../../assets/images/bungie-placeholder.jpg";
import MessageBody from "../Chat/Message/MessageBody";
import GamingSessionIconBar from "../../components/GamingSessionIconBar";

export default class FeedImage extends PureComponent {
  render() {
    if (this.props.item.image_url) {
      return (
        <View>
          <Image
            resizeMode="cover"
            style={[
              styles.image,
              {
                width: "100%"
              }
            ]}
            source={{ uri: this.props.item.image_url }}
          />
          {this.props.item.data.gaming_session_start_time && (
            <GamingSessionIconBar
              style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
              startTime={this.props.item.data.gaming_session_start_time}
            />
          )}
        </View>
      );
    } else if (this.props.item.embed_url) {
      return <MessageBody text={this.props.item.embed_url} />;
    } else if (this.props.item.data && this.props.item.data["image_url"]) {
      return (
        <Image
          resizeMode="cover"
          style={[
            styles.image,
            {
              width: "100%"
            }
          ]}
          source={{ uri: this.props.item.data["image_url"] }}
        />
      );
    } else if (
      this.props.item.data &&
      this.props.item.data["group_image_url"]
    ) {
      return (
        <Image
          resizeMode="cover"
          style={[
            styles.image,
            {
              width: "100%"
            }
          ]}
          source={this.computedPicture(this.props.item.data["group_image_url"])}
        />
      );
    } else if (
      this.props.item.data &&
      this.props.item.data["gaming_session_category"]
    ) {
      return (
        <View>
          <Image
            resizeMode="cover"
            style={[
              styles.image,
              {
                width: "100%"
              }
            ]}
            source={{
              uri: fetchBungieImage(
                this.props.item.data["gaming_session_category"]
              )
            }}
          />
          <GamingSessionIconBar
            style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
            startTime={this.props.item.data.gaming_session_start_time}
            // platform={this.props.item.data.platform}
            // primaryUsersCount={this.props.gamingSession.primary_users_count}
            // teamSize={this.props.gamingSession.team_size}
            // lightLevel={this.props.gamingSession.light_level}
            // sherpaLed={this.props.gamingSession.sherpa_led}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  computedPicture(picture) {
    console.log(picture);
    if (picture === "img/default-user-header.jpg") {
      return defaultUserHeaderBackground;
    } else if (picture === "img/default-group-header.jpg") {
      return defaultGroupHeaderBackground;
    } else if (picture === "img/default-gaming-session-header.jpg") {
      return defaultGamingSessionHeaderBackground;
    } else if (picture === "img/hunter-header.jpg") {
      return hunterHeader;
    } else if (picture === "img/titan-header.jpg") {
      return titanHeader;
    } else if (picture === "img/warlock-header.jpg") {
      return warlockHeader;
    } else {
      return { uri: picture };
    }
  }
}
