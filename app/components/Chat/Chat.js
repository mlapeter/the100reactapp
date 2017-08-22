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
import TimeAgo from "../../../node_modules/react-timeago";

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

  listenForItems(itemsRef) {
    this.setState({ loading: true });

    itemsRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          text: child.val().text,
          key: child.key
        });
      });
      this.setState({
        fbData: items,
        loading: false
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
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
      <View style={styles.li}>
        <Text style={styles.liText}>
          {this.props.item.text} {this.props.item.key}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  icon: {
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  title: {
    padding: 5,
    color: colors.grey,
    fontFamily: "Futura",
    fontSize: fontSizes.primary
  },
  description: {
    padding: 5,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  }
});
