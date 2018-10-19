import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { decodeToken, setFirebaseToken } from "../actions/authentication";
import { changeSelectedGroupId, fetchGroup } from "../actions/group";

import { colors, fontSizes } from "../styles";
import PreSplash from "../components/PreSplash/PreSplash";

import { loadIcons, loadCustomIcons } from "../components/Icon";

import defaultGroupHeaderBackground from "../assets/images/destiny-wallpaper-1.jpg";
import defaultUserHeaderBackground from "../assets/images/d2-all.jpg";
import hunterHeader from "../assets/images/d2-hunter.jpg";
import titanHeader from "../assets/images/d2-titan.jpg";
import warlockHeader from "../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../assets/images/activity-placeholder.jpg";

class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrap();
  }

  componentWillUnmount() {
    console.log("UNMOUNTING AUTHLOADING SCREEN");
    if (this.authTimer) {
      clearTimeout(this.authTimer);
    }
  }

  bootstrap = () => {
    console.log("Starting App");
    loadIcons();
    loadCustomIcons();
    Expo.Asset.loadAsync([
      defaultGroupHeaderBackground,
      defaultUserHeaderBackground,
      hunterHeader,
      titanHeader,
      warlockHeader,
      defaultGamingSessionHeaderBackground
    ]);

    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.veryDarkGrey);
    }
    Font.loadAsync({
      "SFProText-Bold": require("../../app/assets/fonts/SF-Pro-Text-Bold.otf"),
      "SFProText-Semibold": require("../../app/assets/fonts/SF-Pro-Text-Semibold.otf"),
      "SFProText-Regular": require("../../app/assets/fonts/SF-Pro-Text-Regular.otf"),
      Lato: require("../../app/assets/fonts/Lato-Bold.ttf"),
      Nunito: require("../../app/assets/fonts/Nunito-Bold.ttf")
    }).then(result => {
      AsyncStorage.getItem("fb_token").then(token => {
        this.props.dispatch(setFirebaseToken(token));
      });
      AsyncStorage.getItem("id_token").then(token => {
        this.props.dispatch(decodeToken(token));

        this.authTimer = setTimeout(() => {
          if (
            !this.props.users.currentUser ||
            this.props.users.currentUser.gamertag == null ||
            this.props.authentication.isAuthed !== true
          ) {
            this.props.navigation.navigate("Auth");
          } else {
            // AsyncStorage.getItem("default_group_id").then(groupId => {
            //   console.log("default_group_id: ", groupId);
            //   if (groupId) {
            //     this.props.dispatch(changeSelectedGroupId(groupId));
            //   } else {
            //     this.props.dispatch(fetchGroup());
            //   }
            // });
            this.props.navigation.navigate("App");
          }
        }, 3000);
      });
    });
  };

  // Fetch the token from storage then navigate to our appropriate place
  // _bootstrapAsync = async () => {
  //   const userToken = await AsyncStorage.getItem("userToken");
  //
  //   // This will switch to the App screen or Auth screen and this loading
  //   // screen will be unmounted and thrown away.
  //   this.props.navigation.navigate(userToken ? "App" : "Auth");
  // };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <PreSplash />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    // paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  }
});

const mapStateToProps = state => {
  const authentication = state.authentication;
  const users = state.users;
  // const onAuthChange = state.authentication.onAuthChange(token);

  return {
    authentication,
    users,
    authenticationError: state.authentication.error
  };
};

export default connect(mapStateToProps)(connectAlert(AuthLoading));
