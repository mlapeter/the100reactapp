import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeaderBackButton } from "react-navigation";
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";

import Chat from "../components/Chat";

export default class Chatroom extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          room: PropTypes.string.isRequired,
          allowAnon: PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  componentDidMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Chatroom"))
      .catch(e => console.log(e.message));
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params ? navigation.state.params.title : "Chatroom"
    // headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />
  });

  render() {
    let { url, room, allowAnon } = this.props.navigation.state.params;

    return (
      <Chat url={url} room={room} allowAnon={allowAnon} style={{ flex: 1 }} />
    );
  }
}
