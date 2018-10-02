import React, { PureComponent, Component } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";

export default class TopNav extends Component {
  state = {
    searchText: "",
    foundWord: ""
  };

  submitSearch() {
    this.setState({
      searchText: "SUBMITTED"
    });
  }

  // setSearchText(text) {
  //   this.setState({
  //     searchText: text
  //   });
  //   this.filterNotes(text);
  // }
  //
  // filterNotes(searchText) {
  //   var words = [
  //     "spray",
  //     "limit",
  //     "elite",
  //     "exuberant",
  //     "destruction",
  //     "present"
  //   ];
  //   let text = searchText.toLowerCase();
  //
  //   let result = words.filter(word => {
  //     if (word.search(text) !== -1) {
  //       Alert.alert(word);
  //     }
  //   });
  // }

  render() {
    return (
      <View style={styles.optionsContainer}>
        {this.props.user ? (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                style={styles.avatarMini}
                source={
                  this.props.user.computed_avatar_api ===
                  "img/default-avatar.png"
                    ? require("../../assets/images/default-avatar.png")
                    : { uri: this.props.user.computed_avatar_api }
                }
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.search}>
          {this.props.showSearch ? (
            <View style={styles.input}>
              <Icon
                name="md-search"
                size={24}
                color={colors.lightGrey}
                style={{ marginRight: 5 }}
              />
              <TextInput
                value={this.props.searchText}
                onChangeText={searchText =>
                  this.props.setSearchText(searchText)
                }
                onSubmitEditing={() => this.submitSearch()}
                placeholder="Search Users"
                underlineColorAndroid={"transparent"}
                style={{
                  color: colors.white,
                  flex: 1
                }}
              />
              <TouchableOpacity onPress={() => this.props.setSearchText("")}>
                <Icon
                  name="ios-close"
                  size={24}
                  color={
                    this.props.searchText === ""
                      ? colors.searchbar
                      : colors.lightGrey
                  }
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            </View>
          ) : this.props.title ? (
            <View style={styles.titleContainer}>
              <Text style={[styles.title, styleSheet.typography["title3"]]}>
                {this.props.title}
              </Text>
            </View>
          ) : (
            <View style={styles.titleContainer}>
              <Image
                style={styles.image}
                source={require("../../assets/images/the-100-logo.png")}
              />
            </View>
          )}
        </View>
        <View style={styles.add}>
          {this.props.searchButton ? this.props.searchButton : null}
        </View>
        <View style={styles.add}>
          {this.props.newGameButton ? (
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() =>
                this.props.navigation.navigate("GamingSessionCreate")
              }
            >
              <MaterialIcons
                name="add-box"
                size={24}
                style={{
                  color: colors.lightGray
                }}
              />
            </TouchableOpacity>
          ) : null}
          {this.props.rightAction ? (
            <TouchableOpacity onPress={() => Alert.alert("Coming Soon")}>
              <MaterialCommunityIcons
                name="account-plus"
                size={24}
                style={{ color: colors.lightGray }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
