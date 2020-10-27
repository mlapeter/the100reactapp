import React, { PureComponent } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

import TimeAgo from "../../TimeAgo";
import TouchableItem from "../../TouchableItem";
import MessageBody from "./MessageBody";

import { colors, fontSizes, fontStyles } from "../../../styles";

import { ChatMessagePropType } from "../types";

const DEFAULT_AVATAR_IMG = "https://www.the100.io/default-avatar.jpg";

export default class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.shape(ChatMessagePropType).isRequired,
    onLongPress: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      avatarUrl: this.props.message.avatarUrl
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.avatarUrl !== this.props.avatarUrl) {
      this.setState({ avatarUrl: nextProps.avatarUrl });
    }
  }

  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.props.message.key);
    }
  };

  render() {
    return (
      <TouchableItem
        noVisualFeedback={true}
        vibrate={true}
        onLongPress={this.onLongPress}
        onPress={this.props.onPress}
      >
        <View style={styles.box}>
          <View style={styles.leftBox}>
            <Image
              style={styles.avatarMini}
              source={
                this.props.message.avatarUrl === "img/default-avatar.png"
                  ? require("../../../assets/images/default-avatar.jpg")
                  : { uri: this.props.message.avatarUrl }
              }
            />
          </View>
          <View style={styles.middleBox}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.username,
                  usernameStyles[this.props.message.role] || usernameStyles.user
                ]}
              >
                {this.props.message.username}
              </Text>
              <TimeAgo
                style={styles.time}
                date={this.props.message.createdAt}
              />
            </View>
            <MessageBody text={this.props.message.text} />
          </View>
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    margin: 5,
    padding: 5
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 7,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  rightBox: {
    flex: 1.1
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  username: {
    color: colors.grey,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.secondary
  },
  time: {
    padding: 3,
    color: colors.lightestGrey,
    fontSize: fontSizes.small
  },
  text: {
    color: colors.mediumGrey
  }
});

const usernameStyles = StyleSheet.create({
  developer: {
    color: "#fbb829"
  },
  moderators: {
    color: "#9c92e7"
  },
  supporter: {
    color: "#51aeff"
  },
  system: {
    color: "#999"
  },
  user: {
    color: "#337ab7"
  }
});
