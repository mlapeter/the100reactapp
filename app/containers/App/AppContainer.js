// import React, { Component, PropTypes } from "react";
// import { AsyncStorage, Button, StyleSheet, Text, View } from "react-native";
// import { connect } from "react-redux";
// import { TabNavigator } from "react-navigation";
// import { StackNavigator } from "react-navigation";
//
// import PreSplash from "../../components/PreSplash/PreSplash";
// import Splash from "../../components/Splash/Splash";
// import SplashContainer from "../../containers/Splash/SplashContainer";
// import GamingSessionsList from "../../components/GamingSessionsList/GamingSessionsList";
// import Group from "../../components/Group/Group";
// import Notifications from "../../components/Notifications/Notifications";
// import Friends from "../../components/Friends/Friends";
// import Chat from "../../components/Chat/Chat";
//
// import GamingSession from "../../components/GamingSession/GamingSession";
// import Ionicons from "react-native-vector-icons/Ionicons";
//
// import { colors } from "../../styles";
//
// class HomeScreen extends React.Component {
//   static propTypes = {
//     // isAuthenticating: PropTypes.bool.isRequired,
//     navigation: PropTypes.object.isRequired
//   };
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: true,
//       refreshing: false,
//       isAuthed: false
//     };
//   }
//
//   componentWillMount() {
//     AsyncStorage.getItem("id_token").then(token => {
//       this.setState({ isAuthed: token !== null });
//     });
//   }
//
//   componentDidMount() {
//     this.setState({
//       isLoading: true
//     });
//   }
//
//   render() {
//     return (
//       <View style={styles.container}>
//         {this.state.isAuthed === true
//           ? <GamingSessionsList navigation={this.props.navigation} />
//           : <Splash navigation={this.props.navigation} />}
//       </View>
//     );
//   }
// }
//
// const MainScreenNavigator = TabNavigator(
//   {
//     Home: { screen: HomeScreen },
//     Games: { screen: GamingSessionsList },
//     Group: { screen: Group },
//     Notifications: { screen: Notifications },
//     Friends: { screen: Friends }
//   },
//   {
//     // lazy: false,
//     animationEnabled: true
//   }
// );
//
// AppContainer = StackNavigator({
//   // export default (AppContainer = StackNavigator({
//   Home: { screen: MainScreenNavigator },
//   GamingSession: { screen: GamingSession }
// });
//
// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "stretch",
//     backgroundColor: colors.white
//   }
// });
//
// function mapStateToProps({ authentication }) {
//   return {
//     isAuthenticating: authentication.isAuthenticating
//   };
// }
//
// export default connect(mapStateToProps)(AppContainer);
// // connect(mapStateToProps)(HomeScreen);
