import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes, fontStyles } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import TimeAgo from "../../../node_modules/react-native-timeago";

import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";

import {
  fetchChatMessages,
  addChatMessage,
  editChatMessage,
  removeChatMessage
} from "../../actions/chat_messages";

import The100Chat from "./the100chat";

export const HELP_CHAT_ID = -1;

class Chat extends Component {
  static propTypes = {
    chatId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: null
    };

    this.chat = null;
  }

  onMessageCreated = message => {
    this.props.dispatch(addChatMessage(this.props.chatId, message));
  };

  onMessageEdited = message => {
    this.props.dispatch(editChatMessage(this.props.chatId, message));
  };

  onMessageDeleted = message => {
    this.props.dispatch(removeChatMessage(this.props.chatId, message));
  };

  componentDidMount() {
    this.props.dispatch(fetchChatMessages(this.props.chatId));

    if (this.chat) {
      this.chat.unsubscribe();
      this.chat = null;
    }

    if (this.props.userToken) {
      this.chat = new The100Chat(this.props.userToken, this.props.chatId);
      this.chat.on("new_message", this.onMessageCreated);
      this.chat.on("edit_message", this.onMessageEdited);
      this.chat.on("delete_message", this.onMessageDeleted);
    }
  }

  componentWillUnmount() {
    if (this.chat) {
      this.chat.unsubscribe();
      this.chat = null;
    }
  }

  onSubmit = text => {
    if (text && text.trim().length !== 0) {
      this.chat.createMessage(text);
    }
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    let messages = Object.values(this.props.messages[this.props.chatId] || {});
    messages.sort((messageA, messageB) => {
      return messageB.createdAt - messageA.createdAt;
    });

    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        contentContainerStyle={styles.keyboardView}
        behavior="position"
        keyboardVerticalOffset={60}
      >
        <FlatList
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={messages}
          renderItem={({ item }) => <MessageListItem message={item} />}
          keyExtractor={(message, index) => message.id}
          extraData={messages}
        />
        {!this.chat ? null : (
          <MessageInput
            permission="RW"
            onSubmit={this.onSubmit}
            onChange={this.onChange}
          />
        )}
      </KeyboardAvoidingView>
    );
  }
}

class MessageListItem extends Component {
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Image
            style={styles.avatarMini}
            source={{
              uri: this.props.message.user.avatar
            }}
          />
        </View>
        <View style={styles.middleBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.username}>
              {this.props.message.user.username}
            </Text>
            <Text style={styles.time}>
              <TimeAgo time={this.props.message.createdAt} minPeriod="60" />
            </Text>
            <Text style={styles.time} />
          </View>
          <Text style={styles.text}>{this.props.message.text}</Text>
        </View>
      </View>
    );
  }
}

class MessageInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(text) {
    this.props.onSubmit(this.state.text);
    this.setState({
      text: ""
    });
  }

  render() {
    if (
      this.props.permission == "RW" ||
      this.props.permission == "RWE" ||
      this.props.permission == "A"
    ) {
      return (
        <View style={styles.input}>
          <TextInput
            style={{ flex: 5 }}
            placeholder="Enter your message..."
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={text => {
              this.handleSubmit(text);
            }}
            value={this.state.text}
          />
          <Button
            style={styles.button}
            title="Chat"
            onPress={text => {
              this.handleSubmit(text);
            }}
          />
        </View>
      );
    } else {
      return <Text>Login first to chat.</Text>;
    }
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  keyboardView: {
    flex: 1,
    height: 900,
    width: 400,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  container: {
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
    flexDirection: "row",
    margin: 5,
    padding: 5
  },
  input: {
    flexDirection: "row",
    alignItems: "stretch",
    margin: 5,
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da"
  },
  button: {
    margin: 5,
    padding: 5
  },
  leftBox: {
    flex: 1,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 7,
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  rightBox: {
    flex: 1.1
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  username: {
    color: colors.grey,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.secondary
  },
  time: {
    padding: 3,
    color: colors.lightestGrey,
    fontSize: fontSizes.small
  },
  text: {
    color: colors.mediumGrey
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    userToken: state.authentication.token,
    dataSource: state.users.user,
    isLoading: state.users.userLoading,
    userError: state.users.error,
    messages: state.chat_messages.chat_messages
  };
};

export default connect(mapStateToProps)(connectAlert(Chat));
