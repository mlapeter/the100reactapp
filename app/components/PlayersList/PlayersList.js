import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import PlayersItem from "../PlayersItem/PlayersItem";
import { StackNavigator } from "react-navigation";

PlayersList.propTypes = {
  confirmedSessions: PropTypes.array.isRequired
};

export default function PlayersList(props) {
  return (
    <View style={styles.container}>
      {props.confirmedSessions.map(confirmedSession => (
        <PlayersItem
          user={confirmedSession.user}
          key={confirmedSession.id}
          navigation={props.navigation}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da"
  }
});
