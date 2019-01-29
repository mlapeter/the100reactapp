import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { postLike } from "../../utils/api";

export default class Footer extends PureComponent {
  render() {
    let avatars = null;
    let label = null;
    if (this.props.users && this.props.users.avatar_urls) {
      avatars = this.props.users.avatar_urls;
      label = "player";
    } else if (this.props.users && this.props.users.likes) {
      avatars = this.props.users.likes;
      label = "like";
    }
    const plural = avatars && avatars.length > 1 ? "s" : "";

    const clicked =
      avatars && avatars.includes(this.props.currentUser.computed_avatar_api);

    const left = !avatars
      ? 0
      : -5 * (avatars.length - 1) + styleSheet.spacing.tiny;

    return (
      <View style={styles.footer}>
        {avatars ? (
          <View style={styles.comments}>
            {avatars.map((user, index) => (
              <Avatar
                key={index}
                uri={user}
                stacked={!!index}
                style={this.computedStyle(index, avatars.length)}
              />
            ))}
            <Text type="footnote" style={{ left }}>{`${avatars.length} ${label +
              plural}`}</Text>
          </View>
        ) : (
          <View style={styles.comments} />
        )}
        <FeedButton
          clicked={clicked}
          item={this.props.item}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
  computedStyle(index, length) {
    const left = 2 === 0 ? 0 : -5 * (2 - 1) + styleSheet.spacing.tiny;
    return { left: 5 * (length - index - 1) };
  }
}

class FeedButton extends PureComponent {
  state = {
    clicked: this.props.clicked
  };
  render() {
    let feedButton = null;
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
    } else {
      feedButton = {
        icon: this.state.clicked ? "star" : "star-border",
        text: "",
        size: 24,
        onPress: () => {
          this.setState({
            clicked: true
          });
          postLike(this.props.item.id);
        }
      };
    }

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
