import React, { Component } from "react";
import { Button, Linking } from "react-native"
import { Analytics, PageHit } from "expo-analytics";
import { HeaderBackButton, DrawerItems } from "react-navigation";
import Environment from "../config/environment";
import { Text, View, StyleSheet } from "react-native";
import Card from "../components/Card";
import FeedImage from "../components/FeedImage"
import Header from "../components/FeedItem/Header"
import MessageBody from "../components/Chat/Message/MessageBody";
import FeedBody from "../components/FeedItem/Header"
import FeedItem from '../components/FeedItem'

import { WebView } from 'react-native-webview';


import { colors, fontSizes, fontStyles, styleSheet } from "../../app/styles";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";


class Supporters extends Component {
  componentWillMount() {
    const analytics = new Analytics(Environment["GOOGLE_ANALYTICS_ID"]);
    analytics
      .hit(new PageHit("App - Supporters"))
      .catch(e => console.log(e.message));
  }

  componentDidMount() {
    this.openSupportersUrl()
  }

  openSupportersUrl = () => {
    Linking.openURL('https://the100.io/supporters_mobile?id=' + this.props.user.email_token).catch(e => {
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
            title={"Become a supporter!"}
            author_gamertag={"muhuhuhaha"}
          />
          <FeedImage item={{ data: null }} imageUrl={{ uri: "https://www.the100.io/d2-all.jpg" }} style={{ margin: 0 }} />
          <MessageBody
            text={"Want to help us add new features while also getting access to special perks? Become a monthly supporter!"}
            style={[styles.text, styleSheet.typography["body"]]}
          />
          <Button onPress={this.openSupportersUrl} title="Become A Supporter" style={{ padding: 20, marginBottom: 20 }} />
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

export default connect(mapStateToProps)(connectAlert(Supporters));

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    flex: 1
  },
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
  username: {
    justifyContent: "space-between",
    marginLeft: styleSheet.spacing.tiny
  },
  avatarMini: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignSelf: "center"
  },
  card: {
    paddingHorizontal: 0
  },
  caption: {
    padding: styleSheet.spacing.tiny
  },
  image: {
    height: 200
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: styleSheet.spacing.tiny
  },
  comments: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginRight: styleSheet.spacing.tiny,
    flexDirection: "row"
  },
  iconButtonText: {
    alignSelf: "center",
    marginLeft: 2
  }
})
