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
import Moment from "../../../node_modules/react-moment";
import TimeAgo from "../../components/TimeAgo";

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

class Chat extends Component {
  static propTypes = {
    token: PropTypes.string,
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
    firebaseSignIn(this.props.token, true)
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
        console.error("An error occurred during sign in:", error);
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
          //       console.error("Failed to post username mention:", error);
          //     });
          // }
        })
        .catch(error => {
          console.error("Failed to send message:", error);
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
          console.error("Failed to edit message:", error);
        });
      this.setState({ editingKey: null });
    }
  };

  onRemoveMessage = key => {
    this.messagesRef
      .child(key)
      .remove()
      .catch(error => {
        console.error("Failed to remove message:", error);
      });

    if (key === this.state.editingKey) {
      this.setState({ editingKey: null });

      this.requestNotificationPermission();
    }
  };

  onLoadMoreMessages = e => {
    this.setState(prevState => {
      let messageCount = prevState.messageCount + 25;
      return { messageCount: messageCount };
    });
  };

  render() {
    let messages = Object.entries(this.state.messages).sort(
      ([keyA, messageA], [keyB, messageB]) => {
        return messageB.createdAt - messageA.createdAt;
      }
    );

    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        contentContainerStyle={styles.keyboardView}
        behavior="position"
        keyboardVerticalOffset={60}
      >
        <FlatList
          data={messages}
          renderItem={({ item: [key, message] }) => <ListItem item={message} />}
          keyExtractor={([key, message], index) => key}
          extraData={messages}
        />
        <MessageInput
          permission={this.state.permission}
          room={this.props.room}
          url={this.props.url}
          onSubmit={this.onMessageCreate}
        />
      </KeyboardAvoidingView>
    );
  }
}

class ListItem extends Component {
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Image
            style={styles.avatarMini}
            source={{
              uri: this.props.item.avatarUrl
            }}
          />
        </View>
        <View style={styles.middleBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.username}>{this.props.item.username}</Text>
            <TimeAgo style={styles.time} date={this.props.item.createdAt} />
          </View>
          <Text style={styles.text}>{this.props.item.text}</Text>
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
      !this.props.room.includes("group") ||
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

    // authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(Chat));
