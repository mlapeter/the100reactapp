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
          platform={props.platform}
          user={confirmedSession.user}
          key={confirmedSession.id}
          reserve={confirmedSession.reserve_spot}
          navigation={props.navigation}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch"
  }
});
