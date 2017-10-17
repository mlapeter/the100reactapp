import React, { PropTypes, PureComponent, Component } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
        <View style={styles.menu}>
          <TouchableOpacity>
            <Image
              style={styles.avatarMini}
              source={
                this.props.user.computed_avatar_api === "img/default-avatar.png"
                  ? require("../../images/default-avatar.png")
                  : { uri: this.props.user.computed_avatar_api }
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.search}>
          <View style={styles.input}>
            <Icon
              name="md-search"
              size={24}
              color={colors.lightGrey}
              style={{ marginRight: 5 }}
            />
            <TextInput
              value={this.props.searchText}
              onChangeText={searchText => this.props.setSearchText(searchText)}
              onSubmitEditing={() => this.submitSearch()}
              placeholder="Search Users"
              style={{ color: colors.white }}
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
        </View>

        <View style={styles.add}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="account-plus"
              size={24}
              style={{ color: colors.mediumGrey }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },

  menu: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "flex-start"
  },
  search: {
    flexDirection: "row",
    flex: 10,
    marginLeft: 25,
    marginRight: 10,
    padding: 5,
    alignItems: "center",
    paddingHorizontal: 5,
    // borderRadius: 3,
    // borderBottomColor: colors.lightGrey,
    backgroundColor: colors.white
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",

    flex: 1,
    padding: 5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: colors.searchbar
  },
  add: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center"
  },

  optionContainer: {
    // flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
    // borderBottomWidth: 3, // Add thick border at the bottom
    // borderBottomColor: "transparent" // Transparent border for inactive tabs
  },
  avatarMini: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey
  }
});
