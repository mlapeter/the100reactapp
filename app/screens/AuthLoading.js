import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import Sentry from "sentry-expo";

import { Asset, Font } from "expo";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { decodeToken, setFirebaseToken } from "../actions/authentication";
import { fetchGames } from "../actions/search";


import { colors, fontSizes } from "../styles";
import PreSplash from "../components/PreSplash/PreSplash";

import {
  loadIcons,
  loadCustomIcons,
  loadPlatformIcons
} from "../components/Icon";

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
    console.log("UNMOUNTING AUTHLOADING SCREEN!!");
    if (this.authTimer) {
      clearTimeout(this.authTimer);
    }
  }

  componentDidUpdate() {
    if (this.props.users.currentUser && this.props.users.currentUser.gamertag) {
      this.props.navigation.navigate("App");
    }
  }

  cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        console.log("caching: ", image)
        return Image.prefetch(image);
      } else {
        console.log("caching: ", image)
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  async _loadAssetsAsync() {
    const imageAssets = this.cacheImages([
      require("../assets/images/logo.png"),
      require("../assets/images/ic-playstation.png"),
      require("../assets/images/ic-sbox.png"),
      require("../assets/images/ic-windows.png")
    ]);


    await Promise.all(imageAssets);
  }





  bootstrap = () => {
    console.log("Starting App");
    this.props.dispatch(fetchGames());
    this._loadAssetsAsync()
    loadIcons();
    loadCustomIcons();
    loadPlatformIcons();

    console.log("Expo.Asset.loadAsync");
    Asset.loadAsync([
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

    console.log("Font.loadAsync");
    Font.loadAsync({
      "SFProText-Bold": require("../../app/assets/fonts/SF-Pro-Text-Bold.otf"),
      "SFProText-Semibold": require("../../app/assets/fonts/SF-Pro-Text-Semibold.otf"),
      "SFProText-Regular": require("../../app/assets/fonts/SF-Pro-Text-Regular.otf")
    })
      .then(result => {
        console.log("Fetching Firebase Token From Local Storage");
        AsyncStorage.getItem("fb_token").then(token => {
          this.props.dispatch(setFirebaseToken(token));
        });
        console.log("Fetching ID Token From Local Storage");
        AsyncStorage.getItem("id_token").then(token => {
          if (token) {
            this.props.dispatch(decodeToken(token));
          } else {
            this.props.navigation.navigate("Auth");
          }

          this.authTimer = setTimeout(() => {
            if (
              !this.props.users.currentUser ||
              this.props.users.currentUser.gamertag == null ||
              this.props.authentication.isAuthed !== true
            ) {
              console.log("Redirecting to Auth");
              this.props.navigation.navigate("Auth");
            } else {
              console.log("Redirecting to App");
              this.props.navigation.navigate("App");
            }
          }, 4000);
        });
      })
      .catch(err => {
        console.log("Authloading Error: ", err);
        Sentry.captureMessage("Authloading Error: ", err);
        this.props.navigation.navigate("Auth");
      });
  };

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
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  }
});

const mapStateToProps = state => {
  const authentication = state.authentication;
  const users = state.users;
  const games = state.search.games

  return {
    authentication,
    users,
    games
  };
};

export default connect(mapStateToProps)(connectAlert(AuthLoading));
