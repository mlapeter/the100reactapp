import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Text, TouchableWithoutFeedback, View } from "react-native";

import Chat from "../../components/Chat";

export default class ChatPreview extends Component {
  static propTypes = {
    room: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    allowAnon: PropTypes.bool.isRequired,
    onOpenChat: PropTypes.func.isRequired
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onOpenChat}>
        <View style={this.props.stype}>
          <View style={{ paddingHorizontal: 12, paddingTop: 12 }} />
          <Chat
            room={this.props.room}
            url={this.props.url}
            allowAnon={this.props.allowAnon}
            preview={true}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// <Button onPress={this.props.onOpenChat} title="View Chat" />
