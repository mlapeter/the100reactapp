import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Chat from "../components/Chat";

export default class Conversation extends PureComponent {
  static propTypes = {
    conversation: PropTypes.object.isRequired
  };

  /*
  static navigationOptions = ({ navigation }) => {
    return {
      headerVisible: true,
      headerMode: "screen",
      title: `Chat with ${navigation.state.params.conversation.id}`
    };
  };
  */

  render() {
    return (
      <Chat
        url={`chat/conversations/conversation-${this.props.conversation.id}`}
        room={`conversation-${this.props.conversation.id}`}
        allowAnon={false}
      />
    );
  }
}
