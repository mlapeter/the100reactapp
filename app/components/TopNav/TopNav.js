import React, { PropTypes, PureComponent, Component } from "react";
import {
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

export default function TopNav(props) {
  return (
    <View style={styles.optionsContainer}>
      <View style={styles.menu}>
        <TouchableOpacity>
          <Image
            style={styles.avatarMini}
            source={
              props.user.computed_avatar_api === "img/default-avatar.png"
                ? require("../../images/default-avatar.png")
                : { uri: props.user.computed_avatar_api }
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
            placeholder="Search Users"
            style={{ color: colors.white }}
          />
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
