import React, { PropTypes } from "react";
import { View, StyleSheet, Text } from "react-native";
import Player from "./Player";

PlayerList.propTypes = {
  confirmedSessions: PropTypes.array.isRequired
};

export default function PlayerList(props) {
  return (
    <View style={styles.container}>
      {props.confirmedSessions.map(confirmedSession =>
        <Player user={confirmedSession.user} key={confirmedSession.id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
    flexWrap: "wrap",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da"
  }
});
