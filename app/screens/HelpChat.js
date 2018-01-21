import React, { Component } from "react";

import Chat from "../components/Chat";

export default class HelpChat extends Component {
  render() {
    return (
      <Chat
        url="chat/help_chatroom"
        room="help_chatroom"
        allowAnon={true}
        style={{ flex: 1 }}
      />
    );
  }
}
