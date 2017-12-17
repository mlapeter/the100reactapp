import React, { Component } from "react";
import PropTypes from "prop-types";
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

import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";

import firebase from "../../utils/firebase";
import {
  firebaseSignIn,
  getUserChatPermission,
  getUserChatRole
} from "../../utils/user";

import TouchableItem from "../TouchableItem";
import Message from "./Message";

class Chat extends Component {
  static propTypes = {
    firebaseToken: PropTypes.string,
    room: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: {},
      text: "",
      uid: null,
      username: "guest",
      pwnmaster: false,
      role: "user",
      permission: "",
      avatarUrl: "/default-avatar.png",
      users: new Set(),
      editingKey: null,
      messageCount: 25
    };

    this.messagesRef = firebase.database().ref(this.props.url);
    this.messagesQuery = null;
  }

  addMessage(dataSnapshot) {
    let key = dataSnapshot.key;
    let message = dataSnapshot.val();
    message.key = key;

    this.setState(prevState => {
      let { messages, users } = prevState;
      messages[key] = message;
      users.add(message.username);
      return {
        messages: messages,
        users: users
      };
    });
  }

  onMessageAdded = dataSnapshot => {
    this.addMessage(dataSnapshot);
  };

  onMessageChanged = dataSnapshot => {
    this.addMessage(dataSnapshot);
  };

  onMessageRemoved = dataSnapshot => {
    let key = dataSnapshot.key;
    this.setState(prevState => {
      let { messages } = prevState;
      delete messages[key];
      return { message: messages };
    });
  };

  retrieveMessages() {
    if (this.messagesQuery) {
      this.messagesQuery.off();
    }
    this.messagesQuery = this.messagesRef
      .orderByChild("createdAt")
      .limitToLast(this.state.messageCount);

    this.messagesQuery.on("child_added", this.onMessageAdded);
    this.messagesQuery.on("child_changed", this.onMessageChanged);
    this.messagesQuery.on("child_removed", this.onMessageRemoved);
  }

  componentDidMount() {
    firebaseSignIn(this.props.firebaseToken, true)
      .then(user => {
        this.setState({
          uid: user.uid,
          username: user.username,
          pwnmaster: user.pwnmaster,
          role: getUserChatRole(user, this.props.room, "user"),
          permission: getUserChatPermission(user, this.props.room, "RW"),
          avatarUrl: user.avatar
        });

        this.retrieveMessages();
      })
      .catch(error => {
        console.error("An error occurred during sign in: " + error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.messageCount !== prevState.messageCount) {
      this.retrieveMessages();
    }
  }

  componentWillUnmount() {
    if (this.messagesQuery) {
      this.messagesQuery.off();
    }
  }

  onMessageCreate = text => {
    if (text && text.trim().length !== 0) {
      let newMessage = {
        text: text,
        username: this.state.username,
        avatarUrl: this.state.avatarUrl,
        uid: this.state.uid,
        role: this.state.role,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      this.messagesRef
        .push(newMessage)
        .then(() => {
          // let match = text.match(
          //   /\B@([a-z0-9_\-#]+?\b|\[[a-z0-9_\-# ]+?\]\B)/gim
          // );
          // if (match) {
          //   let recipientUsername = match[0].replace(/[@\[\]]/gim, "");
          //   api
          //     .postUsernameMention(
          //       this.props.url,
          //       this.state.username,
          //       recipientUsername,
          //       text
          //     )
          //     .catch(error => {
          //       console.error("Failed to post username mention: " + error);
          //     });
          // }
        })
        .catch(error => {
          console.error("Failed to send message: " + error);
        });
    }
  };

  onStartEditMessage = key => {
    this.setState({ editingKey: key });
  };

  onEditMessage = (key, text) => {
    if (text && text.trim().length !== 0) {
      this.messagesRef
        .child(key)
        .update({
          text: text,
          edited: true,
          editedAt: firebase.database.ServerValue.TIMESTAMP
        })
        .catch(error => {
          console.error("Failed to edit message: " + error);
        });
      this.setState({ editingKey: null });
    }
  };

  onRemoveMessage = key => {
    this.messagesRef
      .child(key)
      .remove()
      .catch(error => {
        console.error("Failed to remove message: " + error);
      });

    if (key === this.state.editingKey) {
      this.setState({ editingKey: null });

      this.requestNotificationPermission();
    }
  };

  onLoadMoreMessages = () => {
    this.setState(prevState => {
      let messageCount = prevState.messageCount + 25;
      return { messageCount: messageCount };
    });
  };

  renderLoadMoreMessages = () => {
    if (Object.keys(this.state.messages).length < this.state.messageCount) {
      return null;
    }

    return (
      <Button title="Load More Messages" onPress={this.onLoadMoreMessages} />
    );
  };

  render() {
    let messages = Object.entries(this.state.messages).sort(
      ([keyA, messageA], [keyB, messageB]) => {
        return messageB.createdAt - messageA.createdAt;
      }
    );

    let createAllowed =
      this.props.room.startsWith("game-") ||
      this.state.permission.includes("W");

    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        contentContainerStyle={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={110}
      >
        <FlatList
          data={messages}
          renderItem={({ item: [key, message] }) => (
            <Message message={message} />
          )}
          keyExtractor={([key, message], index) => key}
          extraData={messages}
          ListFooterComponent={this.renderLoadMoreMessages}
        />
        <MessageInput
          createAllowed={createAllowed}
          onSubmit={this.onMessageCreate}
        />
      </KeyboardAvoidingView>
    );
  }
}

class MessageInput extends React.Component {
  static propTypes = {
    createAllowed: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }

  onChange = text => {
    this.setState({ text: text });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.text);

    this.setState({ text: "" });
  };

  render() {
    if (this.props.createAllowed) {
      return (
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter your message..."
            onChangeText={this.onChange}
            onSubmitEditing={this.onSubmit}
            value={this.state.text}
            autoCapitalize="sentences"
            autoCorrect={true}
          />
          <TouchableItem onPress={this.onSubmit} style={styles.inputButton}>
            <MaterialCommunityIcons
              name="send"
              size={28}
              style={{ color: colors.grey }}
            />
          </TouchableItem>
        </View>
      );
    } else {
      return (
        <View style={styles.input}>
          <Text>Login first to chat.</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  input: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    margin: 5,
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da"
  },
  inputText: {
    flex: 5,
    height: 40
  },
  inputButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5
  }
});

const mapStateToProps = state => {
  const user = state.authentication.user;
  const dataSource = state.users.user;
  const userLoading = state.users.userLoading;
  const firebaseToken = state.authentication.firebaseToken;
  return {
    user,
    dataSource,
    userLoading,
    firebaseToken,
    userError: state.users.error
  };
};

export default connect(mapStateToProps)(connectAlert(Chat));
