import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, Text, View } from "react-native";
//import { Tweet } from "react-twitter-widgets";

import reactStringReplace from "react-string-replace-recursively";
import emoji from "node-emoji";

function usernameMentionMatcherFn(rawText, processed, key) {
  let username = rawText;
  return (
    <Text key={key} style={{ color: "#007fff" }}>
      @{username}
    </Text>
  );
}

const config = {
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
    pattern: /\B-(.+?)-\B/gim,
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
        <Text key={key} style={{ fontFamily: "monospace" }}>
          {processed}
        </Text>
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
  /*
  gifv: {
    pattern: /(https?:\/\/\S+?\.gifv)/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageGifv key={key} source={rawText} />;
    }
  },
  */
  image: {
    pattern: /(https?:\/\/\S+?\.(?:png|jpg|gif|jpeg))/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageImage key={key} source={rawText} />;
    }
  }
  /*
  tweet: {
    pattern: /\bhttps?:\/\/twitter\.com\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)\b/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <div key={key} styleName="block-item">
          <Tweet tweetId={rawText} />
        </div>
      );
    }
  },
  */
  /*
  youtube: {
    pattern: /(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:\S+)?/gim,
    matcherFn: (rawText, processed, key) => {
      let videoId = rawText;
      return (
        <iframe
          key={key}
          styleName="block-item"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          frameBorder={0}
          allowFullScreen={false}
        />
      );
    }
  }
  */
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
        } else if (child.type === Text || child.type == Spoiler) {
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
        children.push(<Text key={"text-" + id}>{currentText}</Text>);
        id++;
      }
      return <View>{children}</View>;
    } catch (e) {
      console.error("Error parsing message text: " + e);
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

class MessageImage extends PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired
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
  }

  onLayout = event => {
    this.setState({
      layoutWidth: event.nativeEvent.layout.width
    });
  };

  onError = e => {
    this.setState({ error: true });
  };

  componentDidMount() {
    Image.getSize(
      this.props.source,
      (width, height) => {
        this.setState({
          imageWidth: width,
          imageHeight: height,
          loaded: true
        });
      },
      error => {
        this.setState({ error: true });
      }
    );
  }

  render() {
    let { source } = this.props;

    if (this.state.error || !this.state.loaded || this.state.imageWidth === 0) {
      return <Text>{source}</Text>;
    } else {
      let imageWidth = Math.min(this.state.imageWidth, this.state.layoutWidth);
      let imageHeight =
        imageWidth / this.state.imageWidth * this.state.imageHeight;
      return (
        <View
          onLayout={this.onLayout}
          style={{
            flex: 1,
            flexDirection: "row"
          }}
        >
          <Image
            source={{ uri: source }}
            onError={this.onError}
            style={{
              width: imageWidth,
              height: imageHeight,
              resizeMode: "contain"
            }}
          />
        </View>
      );
    }
  }
}

class MessageGifv extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  onError = e => {
    this.setState({ error: true });
  };

  render() {
    let { source } = this.props;

    if (this.state.error) {
      return source;
    } else {
      let sourceNoExt = source.replace(/\.gifv$/i, "");
      return (
        <video
          styleName="block-item"
          poster={sourceNoExt + ".jpg"}
          autoPlay={true}
          loop={true}
          preload="auto"
          muted={true}
          playsInline={true}
          alt={source}
          title={source}
          onError={this.onError}
        >
          <source
            src={sourceNoExt + ".mp4"}
            type="video/mp4"
            onError={this.onError}
          />
        </video>
      );
    }
  }
}
