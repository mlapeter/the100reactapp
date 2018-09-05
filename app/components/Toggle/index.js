import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TouchableHighlight, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import { colors, fontSizes, fontStyles } from "../../styles";

function Toggle(props) {
  return (
    <View style={styles.icon}>
      <TouchableHighlight onPress={props.toggle} underlayColor="white">
        <Text style={styles.iconText}>
          {props.title}{" "}
          <MaterialCommunityIcons
            name="settings"
            size={15}
            color={colors.mediumGrey}
          />
        </Text>
      </TouchableHighlight>
    </View>
  );
}

export default Toggle;
