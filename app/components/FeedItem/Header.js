import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from 'prop-types'
import TimeAgo from "../TimeAgo";
import styles from "./styles";
import { styleSheet } from "../../styles";
import Avatar from "../Avatar";

export default class Header extends PureComponent {
  static propTypes = {
    author_avatar_url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author_gamertag: PropTypes.string.isRequired,
    display_after: PropTypes.string.isRequired,
  }


  render() {
    return (
      <View style={styles.header}>
        <View style={styles.user}>
          <Avatar
            uri={
              !this.props.author_avatar_url ||
                this.props.author_avatar_url === "img/default-avatar.png"
                ? "https://www.the100.io/default-avatar.jpg"
                : this.props.author_avatar_url
            }
          />
          <View style={styles.username}>
            <Text style={[styleSheet.typography["headline"]]}>
              {this.props.title}
            </Text>
            {this.props.author_gamertag && (
              <Text style={[styleSheet.typography["footnote"]]}>
                @{this.props.author_gamertag}{" "}
                {this.props.title && this.props.title.length >= 20 && (
                  <TimeAgo date={this.props.display_after} />
                )}
              </Text>
            )}
          </View>
        </View>
        {this.props.title && this.props.title.length < 20 && (
          <Text style={[styleSheet.typography["footnote"]]}>
            <TimeAgo date={this.props.display_after} />
          </Text>
        )}
      </View >
    )
  }
}

