import React, { Component, PureComponent } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Card from "../../components/Card";
Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class GamingSessionItem extends PureComponent {
  render() {
    let cardStyle = {};
    if (
      this.props.data.currentUserId &&
      this.props.data.confirmed_sessions.find(
        session => session.user_id === this.props.data.currentUserId
      )
    ) {
      cardStyle = {
        shadowColor: colors.green,
        shadowOpacity: 0.8,
        shadowRadius: 3,
        borderWidth: Platform.OS === "android" ? 0.75 : 0,
        borderColor: colors.green
      };
    } else if (this.props.data.sherpa_requested) {
      cardStyle = {
        shadowColor: colors.orange,
        shadowOpacity: 0.8,
        shadowRadius: 3,
        borderWidth: Platform.OS === "android" ? 0.75 : 0,
        borderColor: colors.orange
      };
    } else if (
      this.props.data.beginners_welcome ||
      this.props.data.new_member
    ) {
      cardStyle = {
        shadowColor: colors.blue,
        shadowOpacity: 0.8,
        shadowRadius: 3,
        borderWidth: Platform.OS === "android" ? 0.75 : 0,
        borderColor: colors.blue
      };
    }
    return (
      <Card
        onPress={() => {
          this.props.navigation.navigate({
            routeName: "GamingSession",
            params: {
              gamingSessionId: this.props.data.id
            },
            key: "gamingSession-" + this.props.data.id
          });
        }}
        underlayColor="white"
        style={cardStyle}
      >
        <View style={styles.box}>
          <View style={styles.leftBox}>
            <Image
              style={styles.avatarMini}
              source={
                this.props.data.game_avatar_url === "img/default-avatar.png"
                  ? require("../../assets/images/default-avatar.jpg")
                  : { uri: this.props.data.game_avatar_url }
              }
            />
            <Text style={styles.groupNameText}>{this.props.data.clan_tag}</Text>
          </View>
          <View style={styles.middleBox}>
            <Text style={[styleSheet.typography["headline2"]]}>
              {this.props.data.category}
            </Text>
            <Text
              style={[{ color: colors.grey }, styleSheet.typography["summary"]]}
              numberOfLines={2}
            >
              {this.props.data.new_member ? "New Member! " : null}
              {this.props.data.sherpa_requested ? "Sherpa Requested! " : null}
              {this.props.data.beginners_welcome ? "Beginners Welcome! " : null}
              {this.props.data.name}
            </Text>
          </View>
          <View style={styles.rightBox}>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="calendar"
                size={12}
                color={colors.mediumGrey}
              />{" "}
              <Moment format="h:mma" element={Text}>
                {this.props.data.start_time}
              </Moment>
            </Text>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="account"
                size={14}
                color={colors.mediumGrey}
              />{" "}
              {this.props.data.primary_users_count}/{this.props.data.team_size}
            </Text>
            <Text style={styles.iconText}>
              <MaterialCommunityIcons
                name="gauge"
                size={14}
                color={colors.mediumGrey}
              />{" "}
              {!this.props.data.light_level
                ? " any"
                : this.props.data.light_level}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  leftBox: {
    flex: 1,
    paddingTop: 2,
    paddingRight: 6,
    alignItems: "center"
  },
  middleBox: {
    flex: 6,
    backgroundColor: colors.white
  },
  rightBox: {
    flex: 1.8,
    justifyContent: "space-around"
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  },
  groupNameText: {
    paddingTop: 2,
    fontSize: fontSizes.small,
    color: colors.lightestGrey
  }
});

export default GamingSessionItem;
