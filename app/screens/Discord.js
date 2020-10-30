import React, { Component } from "react";
import { Button, Linking } from "react-native"
import { Analytics, PageHit } from "expo-analytics";
import Environment from "../config/environment";
import { Text, View, StyleSheet } from "react-native";
import Card from "../components/Card";
import FeedImage from "../components/FeedImage"
import Header from "../components/FeedItem/Header"
import MessageBody from "../components/Chat/Message/MessageBody";

import { colors, fontSizes, fontStyles, styleSheet } from "../../app/styles";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";


class Discord extends Component {
  UNSAFE_componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Discord"))
      .catch(e => console.log(e.message));
  }

  componentDidMount() {
    this.openDiscordUrl()
  }

  openDiscordUrl = () => {
    Linking.openURL('https://discord.gg/zqCya6u').catch(e => {
      console.log("Failed to open link: " + e);
    });
  }

  render() {

    return (
      <View>
        <Card
          style={styles.card}
        >
          <Header
            author_avatar_url={"https://pwntastic-avatar-production.s3.amazonaws.com/uploads/user/avatar/5/main_mike-hand.png"}
            title={"Join Our Discord"}
            author_gamertag={"muhuhuhaha"}
          />
          <FeedImage item={{ data: null }} imageUrl={{ uri: "https://www.the100.io/d2-all.jpg" }} style={{ margin: 0 }} />
          <MessageBody
            text={"Join Our Discord: https://discord.gg/zqCya6u"}
            style={[styles.text, styleSheet.typography["body"]]}
          />
          <Button onPress={this.openDiscordUrl} title="Open The100.io Discord" style={{ padding: 20, marginBottom: 20 }} />
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const user = state.users.currentUser;

  return {
    user,
  };
};

export default connect(mapStateToProps)(connectAlert(Discord));


styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: styleSheet.spacing.tiny
  },
  text: {
    padding: styleSheet.spacing.tiny,
    color: colors.black
  },
  user: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  card: {
    paddingHorizontal: 0
  },
  image: {
    height: 200
  },
})
