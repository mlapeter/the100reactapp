import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types'
import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { postLike } from "../../utils/api";

export default class Footer extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.object,
    navigation: PropTypes.object.isRequired,

  }


  render() {
    let avatars = null;
    let label = null;
    if (this.props.item.related_users && this.props.item.related_users.avatar_urls) {
      avatars = this.props.item.related_users.avatar_urls;
      label = "player";
    }
    // else if (this.props.users && this.props.users.likes) {
    //   avatars = this.props.users.likes;
    //   label = "like";
    // }
    const plural = avatars && avatars.length && avatars.length > 1 ? "s" : "";
    const clicked =
      avatars && avatars.includes(this.props.currentUser.computed_avatar_api);
    const left =
      !avatars || avatars.length === 0
        ? 0
        : -5 * (avatars.length - 1) + styleSheet.spacing.tiny;

    return (
      <View style={styles.footer}>
        {avatars && avatars.length ? (
          <View style={styles.comments}>
            {avatars.map((url, index) => (
              <Avatar
                key={index}
                uri={
                  url === "img/default-avatar.png"
                    ? "https://www.the100.io/default-avatar.jpg"
                    : url
                }
                stacked={!!index}
                style={this.computedStyle(index, avatars.length)}
              />
            ))}
            <Text type="footnote" style={{ left, alignSelf: "center" }}>{`${
              avatars.length
              } ${label + plural}`}</Text>
          </View>
        ) : (
            <View style={styles.comments} />
          )}
        <FeedButton
          clicked={false}
          item={this.props.item}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
  computedPicture(url) {
    if (url === "img/default-avatar.png") {
      // return defaultUserHeaderBackground
      return { uri: "https://www.the100.io/default-avatar.jpg" };
    } else {
      return { uri: url };
    }
  }
  computedStyle(index, length) {
    return { left: -5 * index };
  }
}

class FeedButton extends PureComponent {
  static propTypes = {
    clicked: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  state = {
    clicked: this.props.clicked
  };

  render() {
    let feedButton = {};
    if (this.props.item.data && this.props.item.data["gaming_session_id"]) {
      feedButton = {
        icon: this.state.clicked ? "person-add" : "outline-person_add-24px",
        text: "",
        size: 22,
        onPress: () => {
          this.props.navigation.navigate("GamingSession", {
            gamingSessionId: this.props.item.data["gaming_session_id"]
          });
        }
      };
    }
    // else if (
    //   (this.props.item && this.props.item.group_id) ||
    //   (this.props.item && this.props.item.game_id)
    // ) {
    //   feedButton = {
    //     icon: this.state.clicked ? "star" : "star-border",
    //     text: "",
    //     size: 24,
    //     onPress: () => {
    //       this.setState({
    //         clicked: true
    //       });
    //       postLike(this.props.item.id);
    //     }
    //   };
    // }

    return (
      <TouchableOpacity onPress={feedButton.onPress} onLongPress={null}>
        <View style={styles.iconButton}>
          <Icon
            name={feedButton.icon}
            color={this.state.clicked ? colors.blue : colors.lightGrey}
            size={feedButton.size}
          />
          <Text
            style={[
              { color: colors.lightGrey },
              styles.iconButtonText,
              styleSheet.typography["callout"]
            ]}
          >
            {feedButton.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
