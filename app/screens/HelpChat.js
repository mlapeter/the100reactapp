import React, { Component } from "react";
import { HeaderBackButton, DrawerItems } from "react-navigation";

import Chat from "../components/Chat";

export default class HelpChat extends Component {
  // static navigationOptions = {
  //   headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />
  // };

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
