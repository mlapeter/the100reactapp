import React, { PureComponent } from "react";
import { Image, Text } from "react-native";
import styles from "./styles";
import { fetchBungieImage } from "../../utils/destinyActivities";
import defaultGroupHeaderBackground from "../../assets/images/d2-all.jpg";
import defaultUserHeaderBackground from "../../assets/images/d2-hunter.jpg";
import hunterHeader from "../../assets/images/d2-hunter.jpg";
import titanHeader from "../../assets/images/d2-titan.jpg";
import warlockHeader from "../../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../../assets/images/bungie-placeholder.jpg";
import MessageBody from "../Chat/Message/MessageBody";

export default class FeedImage extends PureComponent {
  render() {
    if (this.props.item.image_url) {
      return (
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
