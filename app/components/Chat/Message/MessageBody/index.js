import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Image,
  ImageBackground,
  Linking,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import Hyperlink from "../../../Hyperlink";
import AppHyperlink from "../../../AppHyperlink";

import TouchableItem from "../../../TouchableItem";

import reactStringReplace from "react-string-replace-recursively";
import emoji from "node-emoji";
import { colors, fontSizes, fontStyles, styleSheet } from "../../../../styles";

function usernameMentionMatcherFn(rawText, processed, key) {
  return <AppHyperlink key={key} link={rawText} text={"@" + rawText} />;
}

function urlMatcherFn(rawText, processed, key) {
  let regex = /https:\/\/|http:\/\//gi;
  let url = rawText.replace(regex, "");

  return <Hyperlink key={key} link={"https://" + url} />;
}

const config = {
  gifv: {
    pattern: /(\bhttps?:\/\/\S+?\.gifv\b)/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageImage key={key} source={rawText.slice(0, -1)} />;
    }
  },
  image: {
    pattern: /(\bhttps?:\/\/\S+?\.(?:png|jpg|gif|jpeg)\b)/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageImage key={key} source={rawText} />;
    }
  },
  youtube: {
    pattern: /(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:\S+)?/gim,
    matcherFn: (rawText, processed, key) => {
      let videoId = rawText;
      return <Youtube key={key} videoId={videoId} />;
    }
  },
  spoiler: {
    pattern: /\B~~(.+?)~~\B/gim,
    matcherFn: (rawText, processed, key) => {
      return <Spoiler key={key}>{processed}</Spoiler>;
    }
  },
  bold: {
    pattern: /\B\*\*(.+?)\*\*\B/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <Text key={key} style={{ fontWeight: "bold" }}>
          {processed}
        </Text>
      );
    }
  },
  italics: {
    pattern: /\B\*(.+?)\*\B/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <Text key={key} style={{ fontStyle: "italic" }}>
          {processed}
        </Text>
      );
    }
  },
  underline: {
    pattern: /\b_(.+?)_\b/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <Text key={key} style={{ textDecorationLine: "underline" }}>
          {processed}
        </Text>
      );
    }
  },
  /*
  superscript: {
    pattern: /\B\^(.+?)\^\B/gim,
    matcherFn: (rawText, processed, key) => {
      return <sup key={key}>{processed}</sup>;
    }
  },
  */
  strikeThrough: {
    pattern: /\B-(\S.+?\S)-\B/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <Text key={key} style={{ textDecorationLine: "line-through" }}>
          {processed}
        </Text>
      );
    }
  },
  code: {
    pattern: /\B`(.+?)`\B/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        // <Text key={key} style={{ fontFamily: "Monospace" }}>

        <Text key={key}>{processed}</Text>
      );
    }
  },
  emoji: {
    pattern: /(:\w+?:)/gim,
    matcherFn: (rawText, processed, key) => {
      return <Text key={key}>{emoji.get(rawText)}</Text>;
    }
  },
  userMention: {
    pattern: /\B@([a-z0-9_\-#]+?)\b/gim,
    matcherFn: usernameMentionMatcherFn
  },
  userMentionBracketed: {
    pattern: /\B@\[([a-z0-9_\-# ]+?)\]\B/gim,
    matcherFn: usernameMentionMatcherFn
  },
  tweet: {
    pattern: /\bhttps?:\/\/twitter\.com\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)\b/gim,
    matcherFn: (rawText, processed, key) => {
      let tweetId = rawText;
      return (
        <Hyperlink
          key={key}
          link={"https://twitter.com/i/web/status/" + tweetId}
        />
      );
    }
  },
  url: {
    pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/,
    matcherFn: urlMatcherFn
  }
};

const parseMessageText = reactStringReplace(config);

export default class MessageBody extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    let { text } = this.props;

    try {
      let parsedText = parseMessageText(text);
      let children = [];
      let id = 0;
      let currentText = [];
      React.Children.forEach(parsedText, child => {
        if (typeof child === "string") {
          currentText.push(<Text key={"text-" + id}>{child}</Text>);
          id++;
        } else if (
          child.type === Text ||
          child.type == Spoiler ||
          child.type === Hyperlink ||
          child.type === AppHyperlink
        ) {
          currentText.push(child);
        } else {
          if (currentText) {
            children.push(<Text key={"text-" + id}>{currentText}</Text>);
            id++;
            currentText = [];
          }
          children.push(child);
        }
      });
      if (currentText) {
        children.push(
          <Text style={this.props.style} key={"text-" + id}>
            {currentText}
          </Text>
        );
        id++;
      }
      return <View>{children}</View>;
    } catch (e) {
      console.warn("Error parsing message text: " + e);
    }

    return <Text>{text}</Text>;
  }
}

class Spoiler extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  onPress = () => {
    this.setState(prevState => {
      return { show: !prevState.show };
    });
  };

  render() {
    return (
      <Text
        style={
          !this.state.show && {
            color: "transparent",
            backgroundColor: "black"
          }
        }
        onPress={this.onPress}
      >
        {this.props.children}
      </Text>
    );
  }
}

class AutosizeImage extends PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    placeholderRender: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      imageWidth: 0,
      imageHeight: 0,
      layoutWidth: 0,
      error: false
    };

    this.loading = false;
    this.mounted = false;
  }

  onLayout = event => {
    this.setState({
      layoutWidth: event.nativeEvent.layout.width
    });
  };

  onError = e => {
    this.setState({ error: true });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.source !== nextProps.source) {
      this.loading = false;
      this.setState({
        loaded: false,
        imageWidth: 0,
        imageHeight: 0,
        layoutWidth: 0,
        error: false
      });
    }
  }

  componentDidMount() {
    this.mounted = true;

    if (!this.loading && !this.state.error && !this.state.loaded) {
      this.loading = true;

      Image.getSize(
        this.props.source,
        (width, height) => {
          this.loading = false;
          if (this.mounted) {
            this.setState({
              imageWidth: width,
              imageHeight: height,
              loaded: true
            });
          }
        },
        error => {
          console.log("Failed to get size of image: " + error);
          this.loading = false;
          if (this.mounted) {
            this.setState({ error: true });
          }
        }
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    if (this.state.error || !this.state.loaded || this.state.imageWidth === 0) {
      if (this.props.placeholderRender) {
        return this.props.placeholderRender();
      } else {
        return <Text>{this.props.source}</Text>;
      }
    } else {
      let imageWidth = Math.min(this.state.imageWidth, this.state.layoutWidth);
      let imageHeight =
        (imageWidth / this.state.imageWidth) * this.state.imageHeight;
      return (
        <View
          onLayout={this.onLayout}

        >
          <TouchableItem
            useForeground={true}
            onPress={this.props.onPress}
            onLongPress={this.props.onLongPress}
          >
            <ImageBackground
              source={{ uri: this.props.source }}
              onError={this.onError}
              resizeMode="cover"
              style={{

                width: "100%",
                height: 200
              }}
              imageStyle={
                {

                }
              }
            >
              {this.props.children}
            </ImageBackground>
          </TouchableItem>
        </View>
      );
    }
  }
}

class MessageImage extends PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired
  };

  onLongPress = () => {
    Linking.openURL(this.props.source).catch(e => {
      console.log("Failed to open MessageImage url: " + e);
    });
  };

  render() {
    return (
      <AutosizeImage
        source={this.props.source}
        onLongPress={this.onLongPress}
      />
    );
  }
}

class Youtube extends PureComponent {
  static propTypes = {
    videoId: PropTypes.string.isRequired
  };

  onPress = () => {
    Linking.openURL(
      "https://www.youtube.com/watch?v=" + this.props.videoId
    ).catch(e => {
      console.log("Failed to open Youtube URL: " + e);
    });
  };

  placeholderRender = () => {
    return (
      <Hyperlink
        link={"https://www.youtube.com/watch?v=" + this.props.videoId}
      />
    );
  };

  render() {
    return (
      <View>
        <AutosizeImage
          source={`https://img.youtube.com/vi/${
            this.props.videoId
            }/mqdefault.jpg`}
          onPress={this.onPress}
          placeholderRender={this.placeholderRender}
        >
          <Icon
            name="youtube-play"
            size={72}
            style={{ marginVertical: 60, alignSelf: "center", color: "red" }}
          />
        </AutosizeImage>
      </View>
    );
  }
}
