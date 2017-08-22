import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import TimeAgo from "../../../node_modules/react-native-timeago";

import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDTZp0K0KXe7Xt-vGNeYEBDBq-PeJyUTKw",
  authDomain: "the100-staging-42536.firebaseapp.com",
  databaseURL: "https://the100-staging-42536.firebaseio.com/",
  storageBucket: "the100-staging-42536.appspot.com"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fbData: [],
      loading: false
    };
    this.itemsRef = this.getRef().child("/chat/help_chatroom/");
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  componentDidMount() {
    // this.listenForItems(this.itemsRef);
    this.itemsRef.limitToLast(25).on(
      "value",
      function(dataSnapshot) {
        var items = [];
        dataSnapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item["key"] = childSnapshot.key;
          items.push(item);
        });

        this.setState({
          fbData: items.reverse()
        });
      }.bind(this)
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.fbData}
          renderItem={({ item }) => <ListItem item={item} />}
        />
      </View>
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
            <Text style={styles.username}>
              {this.props.item.username}
            </Text>
            <Text style={styles.time}>
              <TimeAgo time={this.props.item.createdAt} minPeriod="60" />
            </Text>
          </View>
          <Text style={styles.text}>
            {this.props.item.text}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
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
    flex: 6,
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
    fontFamily: "Futura",
    fontSize: fontSizes.secondary
  },
  time: {
    padding: 3,
    color: colors.lightGrey,
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
