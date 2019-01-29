import React from "react";
import { Platform, View, WebView } from "react-native";

import styles from "./styles";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import MessageBody from "../Chat/Message/MessageBody";

export const FeedBody = props => {
  let iframeSource = null;
  let iframeHeight = 300;

  if (props.item.body.includes("iframe")) {
    if (props.item.body.match('src="(.*?)" ')) {
      iframeSource = String(props.item.body.match('src="(.*?)" ').pop());
    }
    if (props.item.body.match('height="(.*?)" ')) {
      iframeHeight = Number(props.item.body.match('height="(.*?)" ').pop());
    }
  }

  if (!iframeSource && props.item.body.includes("xboxdvr.com")) {
    iframeSource = props.item.body;
    iframeHeight = 260;
  }

  if (iframeSource) {
    const scalesPageToFit = Platform.OS === "android";

    return (
      <View style={{ height: iframeHeight + 10 }}>
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{
            html: `<head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /></head><body><iframe src="${iframeSource}" width="100%" height="${iframeHeight}" frameborder="0"></iframe></body>`
          }}
          scalesPageToFit={scalesPageToFit}
          bounces={false}
          scrollEnabled={false}
        />
      </View>
    );
  } else {
    return (
      <MessageBody
        text={props.item.body}
        style={[styles.text, styleSheet.typography["body"]]}
      />
    );
  }
};
