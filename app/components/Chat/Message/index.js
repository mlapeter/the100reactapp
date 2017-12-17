import React, { PureComponent } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

import TimeAgo from "../../TimeAgo";

import { colors, fontSizes, fontStyles } from "../../../styles";

import { ChatMessagePropType } from "../types";

export default class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.shape(ChatMessagePropType).isRequired
  };

  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Image
            style={styles.avatarMini}
            source={{
              uri: this.props.message.avatarUrl
            }}
          />
        </View>
        <View style={styles.middleBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.username}>{this.props.message.username}</Text>
            <TimeAgo style={styles.time} date={this.props.message.createdAt} />
          </View>
          <Text style={styles.text}>{this.props.message.text}</Text>
        </View>
      </View>
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
