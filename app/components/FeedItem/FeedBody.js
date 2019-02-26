import React, { PureComponent } from "react";
import { Linking, Platform, Text, View, WebView } from "react-native";
import PropTypes from 'prop-types'
import styles from "./styles";
import { styleSheet } from "../../styles";
import MessageBody from "../Chat/Message/MessageBody";
import moment from "../../../node_modules/moment";

export default class FeedBody extends PureComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    iframeSrc: PropTypes.string,
    iframeHeight: PropTypes.number,
  }

  render() {

    let startTime = ""
    if (this.props.item && (this.props.item.item_type == "player-joined-game" || this.props.item.item_type == "player-left-game") && this.props.item.data && this.props.item.data.gaming_session_start_time) {
      startTime = ` at ${moment(this.props.item.data.gaming_session_start_time).format("hh:mm A  MM/DD/YY")}`
    }

    if (this.props.iframeSrc) {
      const scalesPageToFit = Platform.OS === "android";
      return (
        <View style={{ height: this.props.iframeHeight + 10 }}>
          <WebView
            ref={(ref) => { this.webview = ref; }}
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{
              html: `<head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /></head><body><iframe src="${this.props.iframeSrc}" width="100%" height="${this.props.iframeHeight}" frameborder="0"></iframe></body>`
            }}
            onNavigationStateChange={(event) => {
              console.log(event)
              if (event.url && event.url != "about:blank") {
                this.webview.stopLoading();
                Linking.openURL(event.url).catch(err => console.log('Linking Error: ', err));
              }
            }}
            scalesPageToFit={scalesPageToFit}
            bounces={false}
            scrollEnabled={false}
          />
        </View>
      );
    } else if (this.props.item.body) {
      return (
        <MessageBody
          text={this.props.item.body + startTime}
          style={[styles.text, styleSheet.typography["body"]]}
        />
      );
    } else {
      return (
        <Text>Error - Feed Item Id: {this.props.item.id}</Text>
      )
    }
  }
};

