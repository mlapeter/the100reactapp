// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import moment from "moment";
import TimeAgo from "../../TimeAgo";

import { Avatar, StyleGuide, Text, BaseCard } from "../../components";
import SocialAPI from "../api";

import Header from "./Header";

import type { OptionalNavigationProps } from "../../components/Navigation";

type MessageProps = OptionalNavigationProps & {
  user: string,
  message: string,
  timestamp: number,
  id?: string
};

export default class Notification extends React.PureComponent<MessageProps> {
  static defaultProps = {
    handleColor: "black"
  };

  render(): React.Node {
    let {
      message,
      created_at,
      navigation,
      id,
      handleColor,
      avatar_url,
      notification_type
    } = this.props;

    if (avatar_url === "img/default-avatar.png") {
      avatar_url =
        "https://www.the100.io/assets/ghost-bdd6b51738dab38b1f760df958c62351d571d7cfa97690ea1f87744d35f62574.png";
    }

    return (
      <BaseCard
        onPress={() => navigation && navigation.navigate("Message", { id })}
      >
        <View style={styles.header}>
          <View style={styles.user}>
            <Avatar uri={avatar_url} />
            <View style={styles.username}>
              <Text type="headline" style={styles.headline} color={handleColor}>
                {notification_type.replace("-", " ").replace("-", " ")}
              </Text>
              <Text
                type="footnote"
                style={styles.footnote}
                color={handleColor === "black" ? "#999999" : handleColor}
              >
                @testy
              </Text>
            </View>
          </View>
          <Text type="footnote">
            <TimeAgo date={created_at} />
          </Text>
        </View>
        <Text style={styles.text}>{message}</Text>
      </BaseCard>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: StyleGuide.spacing.tiny
  },
  text: {
    padding: StyleGuide.spacing.tiny
  },
  user: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  username: {
    justifyContent: "space-between",
    marginLeft: StyleGuide.spacing.tiny
  },
  headline: {
    lineHeight: 17
  },
  footnote: {
    lineHeight: 13
  }
});
