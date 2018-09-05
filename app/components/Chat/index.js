import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Keyboard,
  LayoutAnimation,
  ListView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View
} from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { connectAlert } from "../../components/Alert";
import { colors, fontSizes, fontStyles } from "../../styles";
import UsersItemSmall from "../../components/UsersItemSmall";

import firebase from "../../utils/firebase";
import {
  firebaseSignIn,
  getUserChatPermission,
  getUserChatRole
} from "../../utils/user";

import TouchableItem from "../TouchableItem";
import Message from "./Message";
import { ChatMessagePropType } from "./types";

class Chat extends Component {
  static propTypes = {
    firebaseToken: PropTypes.string,
    room: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    allowAnon: PropTypes.bool.isRequired,
    preview: PropTypes.bool
  };

  static defaultProps = {
    preview: false
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: {},
      loading: true,
      text: "",
      uid: null,
      username: "guest",
      pwnmaster: false,
      role: "user",
      permission: "",
      avatarUrl: "/default-avatar.png",
      users: new Set(),
      avatars: new Set(),
      selectedKey: null,
      editingKey: null,
      messageCount: this.props.preview ? 3 : 25,

      keyboardOffset: 0
    };

    this.messagesRef = firebase.database().ref(this.props.url);
    this.messagesQuery = null;

    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  addMessage(dataSnapshot) {
    let key = dataSnapshot.key;
    let message = dataSnapshot.val();
    message.key = key;

    this.setState(prevState => {
      let { messages, users, avatars } = prevState;
      messages[key] = message;
      users.add(message.username);
      avatars.add(message.avatarUrl);
      return {
        messages: messages,
        users: users,
        avatars: avatars
      };
    });
  }

  onMessageAdded = dataSnapshot => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.addMessage(dataSnapshot);
  };

  onMessageChanged = dataSnapshot => {
    this.addMessage(dataSnapshot);
  };

  onMessageRemoved = dataSnapshot => {
    let key = dataSnapshot.key;
    this.setState(prevState => {
      let { messages, selectedKey, editingKey } = prevState;
      delete messages[key];
      let newState = { messages: messages };
      if (key === selectedKey) {
        newState.selectedKey = null;
      }
      if (key === editingKey) {
        newState.editingKey = null;
      }
      return newState;
    });
  };

  retrieveMessages() {
    if (this.messagesQuery) {
      this.messagesQuery.off();
    }
    this.setState({ loading: true });

    this.messagesQuery = this.messagesRef
      .orderByChild("createdAt")
      .limitToLast(this.state.messageCount);

    this.messagesQuery.on("child_added", this.onMessageAdded);
    this.messagesQuery.on("child_changed", this.onMessageChanged);
    this.messagesQuery.on("child_removed", this.onMessageRemoved);

    this.messagesQuery.once("value", () => {
      this.setState({ loading: false });
    });
  }

  onKeyboardShown = event => {
    this.setState({ keyboardOffset: event.endCoordinates.height });
  };

  onKeyboardHidden = event => {
    this.setState({ keyboardOffset: 0 });
  };

  componentWillMount() {
    if (Platform.OS === "ios") {
      Keyboard.addListener("keyboardDidShow", this.onKeyboardShown);
      Keyboard.addListener("keyboardDidHide", this.onKeyboardHidden);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "ios") {
      Keyboard.removeListener("keyboardDidShow", this.onKeyboardShown);
      Keyboard.removeListener("keyboardDidHide", this.onKeyboardHidden);
    }
    if (this.messagesQuery) {
      this.messagesQuery.off();
    }
  }

  componentDidMount() {
    firebaseSignIn(
      this.props.firebaseToken,
      this.props.allowAnon,
      this.props.authedUser
    )
      .then(user => {
        // this setState is triggering warning for setState on unmounted component
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

  onMessageCreate = text => {
    text = text && text.trim();
    if (text) {
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

  canEdit(key) {
    let message = this.state.messages[key];
    return (
      message &&
      (this.state.uid === message.uid ||
        this.state.permission.includes("E") ||
        this.state.pwnmaster === true)
    );
  }

  onMessageLongPress = key => {
    if (this.canEdit(key)) {
      this.setState({ selectedKey: key, editingKey: null });
    }
  };

  closeSelectedModal = () => {
    this.setState({ selectedKey: null });
  };

  onStartEditMessage = key => {
    if (this.state.selectedKey && this.canEdit(this.state.selectedKey)) {
      this.setState({ selectedKey: null, editingKey: this.state.selectedKey });
    }
  };

  onCancelEditing = () => {
    this.setState({ editingKey: null });
  };

  onEditMessage = (key, text) => {
    if (!this.canEdit(key)) {
      this.setState({ editingKey: null });
      return;
    }
    text = text && text.trim();
    if (text) {
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

  onRemoveMessage = () => {
    if (this.state.selectedKey && this.canEdit(this.state.selectedKey)) {
      this.messagesRef
        .child(this.state.selectedKey)
        .remove()
        .catch(error => {
          console.error("Failed to remove message: " + error);
        });

      this.setState({ selectedKey: null, editingKey: null });
    }
  };

  onLoadMoreMessages = () => {
    this.setState(prevState => {
      let messageCount = prevState.messageCount + 25;
      return { messageCount: messageCount };
    });
  };

  renderLoadMoreMessages = () => {
    if (this.props.preview) {
      return null;
    }

    if (this.state.loading) {
      return null;
    }

    if (Object.keys(this.state.messages).length < this.state.messageCount) {
      return null;
    }

    return (
      <Button title="Load More Messages" onPress={this.onLoadMoreMessages} />
    );
  };

  renderListEmpty = () => {
    if (this.state.loading || this.props.preview) {
      return null;
    } else {
      return (
        <Text
          style={{
            textAlign: "center",
            fontSize: fontSizes.primary,
            marginTop: 12
          }}
        >
          No messages
        </Text>
      );
    }
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
      <View
        style={[
          styles.container,
          { paddingBottom: this.state.keyboardOffset },
          this.props.style
        ]}
      >
        <FlatList
          data={messages}
          renderItem={({ item: [key, message] }) => (
            <Message
              message={message}
              onLongPress={this.props.preview ? null : this.onMessageLongPress}
            />
          )}
          keyExtractor={([key, message], index) => key}
          extraData={messages}
          ListFooterComponent={this.renderLoadMoreMessages}
          ListEmptyComponent={this.renderListEmpty}
        />
        {!this.props.preview &&
          (!this.state.editingKey ? (
            <MessageCreateInput
              createAllowed={createAllowed}
              onSubmit={this.onMessageCreate}
              users={this.state.users}
              avatars={this.state.avatars}
            />
          ) : (
            <MessageEditInput
              onSubmit={this.onEditMessage}
              onCancel={this.onCancelEditing}
              message={this.state.messages[this.state.editingKey]}
            />
          ))}
        {!this.props.preview && (
          <Modal
            isVisible={!!this.state.selectedKey}
            style={styles.selectedModal}
            onBackButtonPress={this.closeSelectedModal}
            onBackdropPress={this.closeSelectedModal}
            backdropOpacity={0.3}
          >
            <View style={styles.selectedModalBackground}>
              <TouchableItem
                style={[
                  styles.selectedModalOption,
                  styles.selectedModalOptionSeparator
                ]}
                useForeground={true}
                onPress={this.onStartEditMessage}
              >
                <Text style={styles.selectedModalOptionText}>Edit</Text>
              </TouchableItem>
              <TouchableItem
                style={[styles.selectedModalOption, styles.removeOption]}
                useForeground={true}
                onPress={this.onRemoveMessage}
              >
                <Text
                  style={[
                    styles.selectedModalOptionText,
                    styles.removeOptionText
                  ]}
                >
                  Remove
                </Text>
              </TouchableItem>
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

class MessageCreateInput extends PureComponent {
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
    this.filterUsernamesAndAvatars(text);
  };

  filterUsernamesAndAvatars = text => {
    let usernamesArray = Array.from(this.props.users.values());
    let avatarsArray = Array.from(this.props.avatars.values());
    const usernameAvatars = avatarsArray.reduce(
      (result, avatar, index) => ({
        ...result,
        [usernamesArray[index]]: avatar
      }),
      {}
    );
    let escapedText = text.replace(/([()[{*+.$^\\|?])/g, "\\$1");
    let results = usernamesArray.filter(user => {
      return (
        escapedText.includes("@") &&
        ("@" + user).toLowerCase().search(escapedText) !== -1
      );
    });
    this.setState({
      usernameResults: results,
      usernameAvatars: usernameAvatars
    });
  };

  autofillUsername = username => {
    this.setState({
      text: "@" + username + " ",
      usernameResults: []
    });
    this.chatInput.focus();
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.text);

    this.setState({ text: "" });
  };

  render() {
    if (this.props.createAllowed) {
      return (
        <View>
          <View style={styles.usernameResults}>
            <FlatList
              data={this.state.usernameResults}
              renderItem={({ item }) => (
                <UsersItemSmall
                  user={item}
                  usernameAvatars={this.state.usernameAvatars}
                  onPress={() => this.autofillUsername(item)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state.usernameResults}
              onEndReachedThreshold={0}
              keyboardShouldPersistTaps={
                this.state.usernameResults &&
                this.state.usernameResults.length > 0
                  ? "always"
                  : "never"
              }
            />
          </View>

          <View style={styles.input}>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your message..."
              onChangeText={this.onChange}
              onSubmitEditing={this.onSubmit}
              value={this.state.text}
              autoCapitalize="none"
              autoCorrect={true}
              returnKeyType="send"
              underlineColorAndroid={"transparent"}
              ref={input => {
                this.chatInput = input;
              }}
              blurOnSubmit={false}
            />
            <TouchableItem onPress={this.onSubmit} style={styles.inputButton}>
              <MaterialCommunityIcons
                name="send"
                size={28}
                style={{ color: colors.grey }}
              />
            </TouchableItem>
          </View>
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

class MessageEditInput extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    message: PropTypes.shape(ChatMessagePropType).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.message.text
    };
  }

  onChange = text => {
    this.setState({ text: text });
  };

  onSubmit = () => {
    this.props.onSubmit(this.props.message.key, this.state.text);

    this.setState({ text: "" });
  };

  render() {
    return (
      <View style={styles.input}>
        <View style={{ marginRight: 8 }}>
          <Button title="Cancel" onPress={this.props.onCancel} />
        </View>
        <TextInput
          style={[styles.inputText, { paddingHorizontal: 10 }]}
          placeholder="Enter your message..."
          onChangeText={this.onChange}
          onSubmitEditing={this.onSubmit}
          value={this.state.text}
          autoCapitalize="none"
          autoCorrect={true}
          autoFocus={true}
          returnKeyType="done"
          underlineColorAndroid={"transparent"}
        />
        <TouchableItem onPress={this.onSubmit} style={styles.inputButton}>
          <MaterialCommunityIcons
            name="check"
            size={28}
            style={{ color: colors.grey }}
          />
        </TouchableItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  selectedModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  selectedModalBackground: {
    backgroundColor: colors.white
  },
  selectedModalOption: {
    padding: 20,
    alignItems: "center"
  },
  selectedModalOptionSeparator: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da"
  },
  removeOption: {
    backgroundColor: "#fc4c46"
  },
  removeOptionText: {
    color: "white"
  },
  selectedModalOptionText: {
    fontSize: 22
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
  },
  usernameResults: {
    maxHeight: 150
  }
});

const mapStateToProps = state => {
  return {
    firebaseToken: state.authentication.firebaseToken,
    authedUser: state.authentication.user
  };
};

export default connect(mapStateToProps)(connectAlert(Chat));
