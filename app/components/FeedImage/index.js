import React, { PureComponent } from "react";
import { Image, View } from "react-native";
import PropTypes from 'prop-types'
import styles from "./styles";
import MessageBody from "../Chat/Message/MessageBody";
import GamingSessionIconBar from "../../components/GamingSessionIconBar";

export default class FeedImage extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    imageUrl: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
  }

  render() {
    if (this.props.imageUrl) {

      return (
        <View>
          <Image
            resizeMode="cover"
            style={[
              styles.image,
              {
                width: "100%"
              }
            ]}
            source={this.props.imageUrl}
          />
          {this.props.item.data && this.props.item.data.gaming_session_start_time && (
            <GamingSessionIconBar
              style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
              startTime={this.props.item.data.gaming_session_start_time}
            />
          )}
        </View>
      );
    }
    else if (this.props.item.embed_url) {
      return <MessageBody text={this.props.item.embed_url} />;
    } else {
      return null;
    }
  }

}
