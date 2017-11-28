import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
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

import { fetchChatMessages } from "../../actions/chat_messages";

import The100Chat from "./the100chat";

class Chat extends Component {
  static propTypes = {
    // chatroom: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      messages: {}
    };

    this.chat = null;
  }

  addMessages(newMessages) {
    this.setState(prevState => {
      let { messages } = prevState;
      newMessages.forEach(message => {
        messages[message.id] = message;
      });
      return {
        messages: messages
      };
    });
  }

  onMessageCreatedEdited = message => {
    this.addMessages([message]);
  };

  onMessageDeleted = message => {
    this.setState(prevState => {
      let { messages } = prevState;
      delete messages[message.id];
      return { messages: messages };
    });
  };

  componentDidMount() {
    this.props.dispatch(fetchChatMessages());

    if (this.chat) {
      this.chat.unsubscribe();
      this.chat = null;
    }

    AsyncStorage.getItem("id_token").then(token => {
      console.warn("CREATING CHAT", token);
      this.chat = new The100Chat(token, 1);
      this.chat.on("new_message", this.onMessageCreatedEdited);
      this.chat.on("edit_message", this.onMessageCreatedEdited);
      this.chat.on("delete_message", this.onMessageDeleted);
    });
  }

  componentWillUnmount() {
    if (this.chat) {
      this.chat.unsubscribe();
      this.chat = null;
    }
  }

  onSubmit = text => {
    if (text && text.trim().length !== 0) {
      /*
      var imgSrc = this.createImg(text);
      this.firebaseRef.push({
        text: text,
        imgSrc: imgSrc,
        username: this.state.username,
        avatarUrl: this.state.avatarUrl,
        uid: firebase.auth().currentUser.uid,
        role: this.state.role,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });
      this.setState({ editing: null });
      */
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
          data={this.props.chatMessages}
          renderItem={({ item }) => <ListItem item={item} />}
          // duplicates due to multiple instances of same chat in app
          keyExtractor={(item, index) => index}
          extraData={this.props.chatMessages}
        />
        <MessageInput
          permission="RW"
          room="help_chatroom"
          url="chat/help_chatroom"
          onSubmit={this.onSubmit}
          onChange={this.onChange}
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
            <Text style={styles.time}>
              <TimeAgo time={this.props.item.createdAt} minPeriod="60" />
            </Text>
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
  return {
    user,
    dataSource,
    userLoading,
    userError: state.users.error,
    chatMessages: state.chat_messages.chat_messages

    // authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(Chat));
