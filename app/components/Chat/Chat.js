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

import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDTZp0K0KXe7Xt-vGNeYEBDBq-PeJyUTKw",
  authDomain: "the100-staging-42536.firebaseapp.com",
  databaseURL: "https://the100-staging-42536.firebaseio.com/",
  storageBucket: "the100-staging-42536.appspot.com"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class Chat extends Component {
  static propTypes = {
    // chatroom: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      items: [],
      text: "",
      username: "guest",
      pwnmaster: false,
      role: "user",
      permission: "",
      avatarUrl: "/default-avatar.png",
      editing: null,
      room: this.props.room
    };
    this.firebaseRef = this.getRef().child("/chat/help_chatroom/");
  }

  componentWillMount() {
    if (this.props.firebaseToken) {
      firebase
        .auth()
        .signInWithCustomToken(this.props.firebaseToken)
        .then(
          function() {
            console.log("SIGNED IN TO FIREBASE!");
            // writeUserData(firebase.auth().currentUser.uid);
            firebase
              .database()
              .ref("/users/" + firebase.auth().currentUser.uid)
              .on("value", snapshot => {
                console.log(snapshot);
                this.setState({ username: snapshot.val().username });
                this.setState({ pwnmaster: snapshot.val().pwnmaster });
                if (snapshot.val().pwnmaster == "true") {
                  this.setState({ role: "developer" });
                } else {
                  this.setState({
                    role: snapshot.val().groups[this.props.room]["role"]
                  });
                }
                this.setState({
                  permission: snapshot.val().groups[this.props.room][
                    "permission"
                  ]
                });
                this.setState({ avatarUrl: snapshot.val().avatar });
                console.log("USER FOUND");
              });
          }.bind(this)
        )
        .catch(function(error) {
          console.log("ERROR WITH TOKEN: " + error.code + ":" + error.message);
        });
    } else {
      console.log("STARTING ANON SIGNIN");
      firebase
        .auth()
        .signInAnonymously()
        .catch(function(error) {
          console.log(
            "ANON SIGNIN ERROR WITH TOKEN " + error.code + ":" + error.message
          );
        });
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("CURRENT USER: " + firebase.auth().currentUser.uid);
        this.user = firebase.auth().currentUser;
      } else {
        // User is signed out.
      }
    });
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(firebaseRef) {
    firebaseRef.limitToLast(25).on("value", snap => {
      var items = [];
      snap.forEach(child => {
        var item = child.val();
        item["key"] = child.key;
        items.push(item);
      });

      this.setState({
        items: items.reverse(),
        isLoading: false
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.firebaseRef);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  createImg(text) {
    var imgPattern = /(https?:\/\/.*\.(?:png|jpg|gif|gifv|jpeg))/i;
    var imgurPattern = /((http(s?):\/\/)?(imgur|i.imgur)\.com\/[a-zA-Z0-9]{6,8})(?!\.jpg|\.gif|\.gifv|\.png)(?:[^a-zA-Z0-9]|$)/;
    if (text.match(imgPattern)) {
      console.log(text.match(imgPattern));
      return text.match(imgPattern)[0];
    } else if (text.match(imgurPattern)) {
      console.log(text.match(imgurPattern));
      return text.match(imgurPattern)[0] + ".jpg";
    } else {
      return "";
    }
  }

  onSubmit = text => {
    if (text && text.trim().length !== 0) {
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
      // var pattern = /\B@[a-z0-9_-]+/gi;
      // if (text.match(pattern)) {
      //   api.postUsernameMention(this.props.url, this.state.username, text.match(pattern), text)
      //     .then(function (response) {
      //       console.log(response)
      //     })
      // }
    }
  };

  render() {
    if (this.state.isLoading) {
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
          data={this.state.items}
          renderItem={({ item }) => <ListItem item={item} />}
          // duplicates due to multiple instances of same chat in app
          keyExtractor={(item, index) => index}
          extraData={this.state.items}
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
              <TimeAgo date={this.props.item.createdAt} />
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
