import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import PreSplash from "../components/PreSplash/PreSplash";
import Chat from "../components/Chat";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchGroup } from "../actions/group";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class Group extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    groupError: PropTypes.string,
    group: PropTypes.object
  };

  componentWillMount() {
    this.fetchGroupData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.groupError &&
      nextProps.groupError !== this.props.groupError
    ) {
      this.props.alertWithType("error", "Error", nextProps.groupError);
    }
  }

  fetchGroupData = () => {
    console.log("Fetching Group");
    this.props.dispatch(fetchGroup());
  };

  // giveKarma() {
  //   this.postData("/give_karma");
  //   Alert.alert("Karma Given!");
  // }
  //
  // addFriend() {
  //   this.postData("/add_friend");
  //   Alert.alert("Friend Request Sent!");
  // }

  // postData(action) {
  //   this.setState({
  //     isLoading: true
  //   });
  //   AsyncStorage.getItem("id_token").then(token => {
  //     console.log("token: " + token);
  //     fetch("https://pwn-staging.herokuapp.com/api/v2/groups/" + action, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token
  //       }
  //     })
  //       .then(response => response.json())
  //       .then(responseJson => {
  //         this.fetchGroupData();
  //         console.log("ACTION POSTED");
  //         console.log(responseJson);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   });
  // }

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else if (!this.props.group) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={this.fetchGroupData}
          >
            <Text style={styles.buttonText}>Get Group</Text>
          </TouchableOpacity>
        </View>
      );
    }

    let room = `group-${this.props.group.id}`;

    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={
            this.props.group.header_background_image_api ===
            "img/default-group-header.jpg"
              ? defaultGroupHeaderBackground
              : { uri: this.props.group.header_background_image_api }
          }
        >
          <Text style={styles.title}>{this.props.group.name}</Text>
        </Image>
        <View style={styles.innerContainer}>
          <Text style={styles.description} numberOfLines={3}>
            {this.props.group.description != null
              ? this.props.group.description
              : ""}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {this.props.group.latest_news != null
              ? this.props.group.latest_news
              : ""}
          </Text>
          <View style={styles.iconBar}>
            <PlatformIcon platform={this.props.group.platform} />
            <PlayerIcon usersCount={this.props.group.users_count} />
            <Text style={styles.icon}>
              <MaterialCommunityIcons
                name="human-greeting"
                size={14}
                color={colors.grey}
              />
              <Text style={styles.icon}>Casual</Text>
            </Text>
            <PlayScheduleIcon playSchedule={this.props.group.play_schedule} />
          </View>
          <Chat room={room} url={`chat/groups/${room}`} />
        </View>
      </View>
    );
  }
}

function KarmaButton(props) {
  if (props.karmaReceivedFrom.includes(userId)) {
    return <Text>Karma Given</Text>;
  } else {
    return (
      <View>
        <Button
          style={{
            height: 30,
            width: 150,
            margin: 5
          }}
          onPress={props.giveKarma}
          title="Give Karma"
        />
      </View>
    );
  }
}

function FriendButton(props) {
  if (props.friendsWith.includes(userId)) {
    return <Text>Friends</Text>;
  } else {
    return (
      <View>
        <Button
          style={{
            height: 30,
            width: 150,
            margin: 5
          }}
          onPress={props.addFriend}
          title="Add Friend"
        />
      </View>
    );
  }
}

function PlatformIcon(props) {
  if (props.platform === "ps4") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="playstation"
          size={14}
          color={colors.grey}
        />
        PS4
      </Text>
    );
  } else if (props.platform === "xbox-one") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="xbox" size={14} color={colors.grey} />
        XBOX
      </Text>
    );
  } else {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="microsoft"
          size={14}
          color={colors.grey}
        />
        PC
      </Text>
    );
  }
}

function PlayScheduleIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />
      <Text style={styles.icon}>Weekday Mornings</Text>
    </Text>
  );
}

function PlayerIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.usersCount}
    </Text>
  );
}

function PowerIcon(props) {
  if (props.lightLevel) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
        {props.lightLevel}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
      Any
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    justifyContent: "center",
    alignItems: "stretch"
  },
  backgroundImage: {
    resizeMode: "cover", // or 'stretch'
    height: 150,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    backgroundColor: "rgba( 0, 0, 0, 0.5 )",
    borderRadius: 3,
    color: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
  },
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "center",
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
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary,
    padding: 5
  },
  tagList: {
    padding: 5,
    paddingBottom: 10,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  },
  titleAndTags: {
    flexDirection: "column",
    flex: 2
  }
});

const mapStateToProps = state => {
  return {
    group: state.group.group,
    isLoading: state.group.isLoading,
    groupError: state.group.error
  };
};

export default connect(mapStateToProps)(connectAlert(Group));
