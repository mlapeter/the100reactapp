import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";
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
  /*
  spoiler: {
    pattern: /\B~~(.+?)~~\B/gim,
    matcherFn: (rawText, processed, key) => {
      return (
        <span key={key} styleName="spoiler">
          {processed}
        </span>
      );
    }
  },
  */
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
  }
  /*
  gifv: {
    pattern: /(https?:\/\/\S+?\.gifv)/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageGifv key={key} source={rawText} />;
    }
  },
  */
  /*
  image: {
    pattern: /(https?:\/\/\S+?\.(?:png|jpg|gif|jpeg))/gim,
    matcherFn: (rawText, processed, key) => {
      return <MessageImage key={key} source={rawText} />;
    }
  },
  */
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

export default class MessageBody extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    let { text } = this.props;

    try {
      return <Text>{parseMessageText(text)}</Text>;
    } catch (e) {
      console.error("Error parsing message text: " + e);
    }

    return <Text>{text}</Text>;
  }
}

class MessageImage extends React.Component {
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
      return (
        <img
          styleName="block-item"
          src={source}
          alt={source}
          title={source}
          onError={this.onError}
        />
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
