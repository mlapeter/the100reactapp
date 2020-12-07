import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import PlayersItem from "../PlayersItem/PlayersItem";
import { StackNavigator } from "react-navigation";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";


PlayersList.propTypes = {
  confirmedSessions: PropTypes.array.isRequired
};

export default function PlayersList(props) {

  const reservePlayers = props.confirmedSessions.filter(confirmedSession => (confirmedSession.is_reserve))
  const waitlistPlayers = props.confirmedSessions.filter(confirmedSession => (confirmedSession.is_waitlist))

  return (
    <View>
      <Text style={[styleSheet.typography["headline2"]]}>
        Players:
              </Text>
      <View style={styles.container}>

        {props.confirmedSessions.filter(confirmedSession => (!confirmedSession.is_reserve && !confirmedSession.is_waitlist)).map((confirmedSession, index) => (
          <PlayersItem
            platform={props.platform}
            user={confirmedSession.user}
            key={confirmedSession.id}
            reserve={confirmedSession.is_reserve}
            waitlist={confirmedSession.is_waitlist}
            index={index}
            navigation={props.navigation}
          />
        ))}
      </View>

      {waitlistPlayers.length > 0 && (

        <View>
          <Text style={[styleSheet.typography["headline2"]]}>
            Waitlist:
              </Text>
          <View style={styles.container}>

            {waitlistPlayers.map((confirmedSession, index) => (
              <PlayersItem
                platform={props.platform}
                user={confirmedSession.user}
                key={confirmedSession.id}
                reserve={confirmedSession.is_reserve}
                waitlist={confirmedSession.is_waitlist}
                index={index + 1}
                navigation={props.navigation}
              />
            ))}
          </View>
        </View>
      )}

      {reservePlayers.length > 0 && (
        <View>


          <Text style={[styleSheet.typography["headline2"]]}>
            Reserve / Backups:
              </Text>
          <View style={styles.container}>

            {reservePlayers.map((confirmedSession, index) => (
              <PlayersItem
                platform={props.platform}
                user={confirmedSession.user}
                key={confirmedSession.id}
                reserve={confirmedSession.is_reserve}
                waitlist={confirmedSession.is_waitlist}
                index={index + 1}
                navigation={props.navigation}
              />
            ))}
          </View>
        </View>
      )}

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
