import React, { Component } from "react";
import { Analytics, PageHit } from "expo-analytics";
import { HeaderBackButton, DrawerItems } from "react-navigation";
import Environment from "../config/environment";

import Chat from "../components/Chat";

export default class HelpChat extends Component {
  componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Help Chat"))
      .catch(e => console.log(e.message));
  }
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
