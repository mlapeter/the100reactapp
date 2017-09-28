import React, { Component, PropTypes } from "react";
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
import Chat from "../components/Chat/Chat";

import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigator } from "react-navigation";

import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { fetchGroup } from "../actions/group";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class Group extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    groupError: PropTypes.string,
    dataSource: PropTypes.object
  };
  static navigationOptions = {
    title: "User"
  };

  constructor(props) {
    super(props);
    // this.state = {
    //   hasJoined: false,
    //   isLoading: true,
    //   refreshing: false,
    //   gameData: ""
    // };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    // this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.groupError &&
      nextProps.groupError !== this.props.groupError
    ) {
      this.props.alertWithType("error", "Error", nextProps.groupError);
    }
  }

  fetchData() {
    console.log("Fetching Group");
    this.props.dispatch(fetchGroup());

    //
    // AsyncStorage.getItem("id_token").then(token => {
    //   fetch("https://pwn-staging.herokuapp.com/api/v2/groups/47", {
    //     method: "GET",
    //     headers: { Authorization: "Bearer " + token }
    //   })
    //     .then(response => response.json())
    //     .then(responseJson => {
    //       this.setState({
    //         isLoading: false,
    //         dataSource: responseJson
    //       });
    //       return responseJson;
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // });
  }

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
  //         this.fetchData();
  //         console.log("ACTION POSTED");
  //         console.log(responseJson);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   });
  // }

  render() {
    const { params } = this.props.navigation.state;

    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      if (this.props.dataSource === undefined) {
        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={this.fetchData}
            >
              <Text style={styles.buttonText}>Get Group</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={
            this.props.dataSource.header_background_image_api ===
            "img/default-avatar.png"
              ? require("../images/default-avatar.png")
              : { uri: this.props.dataSource.header_background_image_api }
          }
        >
          <Text style={styles.title}>{this.props.dataSource.name}</Text>
        </Image>
        <View style={styles.innerContainer}>
          <Text style={styles.description} numberOfLines={3}>
            {this.props.dataSource.description != null
              ? this.props.dataSource.description
              : ""}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {this.props.dataSource.latest_news != null
              ? this.props.dataSource.latest_news
              : ""}
          </Text>

          <View style={styles.iconBar}>
            <PlatformIcon platform={this.props.dataSource.platform} />
            <PlayerIcon usersCount={this.props.dataSource.users_count} />
            {/* <PlayScheduleIcon
              playSchedule={this.props.dataSource.play_schedule}
            /> */}
          </View>
          {/* <Chat chatroom={"help_chatroom"} /> */}
        </View>
      </View>
    );
  }
}

function KarmaButton(props) {
  console.log("User ID: " + userId);
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
  console.log("User ID: " + userId);
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
      <Text style={styles.icon}>{props.playSchedule.toString()}</Text>
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
    marginTop: 30,
    flex: 1,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da"
  },
  innerContainer: {
    padding: 5,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  backgroundImage: {
    resizeMode: "cover", // or 'stretch'
    height: 150
  },
  actionButtons: {
    flexDirection: "column",
    margin: 5,
    flex: 1.4
  },
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  groupImage: {
    height: 100,
    flex: 1
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 5
  },

  title: {
    backgroundColor: "transparent",
    textAlign: "center",
    padding: 40,
    paddingTop: 100,
    color: colors.white,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
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
  const dataSource = state.group.group;
  const isLoading = state.group.isLoading;

  return {
    dataSource,
    isLoading,
    groupError: state.group.error
  };
};

export default connect(mapStateToProps)(connectAlert(Group));
