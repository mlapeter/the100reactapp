import React from "react";
import { View, Text } from "react-native";
import PropTypes from 'prop-types'
import TimeAgo from "../TimeAgo";
import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Avatar from "../Avatar";

export const Header = props => (
  <View style={styles.header}>
    <View style={styles.user}>
      <Avatar
        uri={
          !props.item.author_avatar_url ||
            props.item.author_avatar_url === "img/default-avatar.png"
            ? "https://www.the100.io/default-avatar.jpg"
            : props.item.author_avatar_url
        }
      />
      <View style={styles.username}>
        <Text style={[styleSheet.typography["headline"]]}>
          {props.item.title}
        </Text>
        {props.item.author_gamertag && (
          <Text style={[styleSheet.typography["footnote"]]}>
            @{props.item.author_gamertag}{" "}
            {props.item.title && props.item.title.length >= 20 && (
              <TimeAgo date={props.item.created_at} />
            )}
          </Text>
        )}
      </View>
    </View>
    {props.item.title && props.item.title.length < 20 && (
      <Text style={[styleSheet.typography["footnote"]]}>
        <TimeAgo date={props.item.created_at} />
      </Text>
    )}
  </View >
);

Header.propTypes = {
  item: PropTypes.object.isRequired,
}