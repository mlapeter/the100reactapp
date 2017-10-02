// import React, { Component, PropTypes, PureComponent } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { colors, fontSizes } from "../../styles";
// import PreSplash from "../../components/PreSplash/PreSplash";
// import GamingSessionsItem from "../../components/GamingSessionsItem/GamingSessionsItem";
// import GamingSessionsFilter from "../../components/GamingSessionsFilter/GamingSessionsFilter";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import { Icon } from "@expo/vector-icons";
// import Ionicons from "react-native-vector-icons/Ionicons";
//
// import Tabs from "../../components/Tabs/Tabs";
//
// import { connect } from "react-redux";
// import { fetchGames } from "../../actions/search";
// import { changePage } from "../../actions/search";
// import { fetchGamingSessions } from "../../actions/gamingSessions";
// import { refreshGamingSessions } from "../../actions/gamingSessions";
// import { loadMoreGamingSessions } from "../../actions/gamingSessions";
// import { fetchMyGamingSessions } from "../../actions/gamingSessions";
//
// class MyGamingSessionsList extends React.PureComponent {
//   static propTypes = {
//     activity: PropTypes.string,
//     game: PropTypes.object,
//     gameId: PropTypes.string,
//     notFull: PropTypes.number,
//     page: PropTypes.number,
//     platform: PropTypes.string,
//     isLoading: PropTypes.bool,
//     refreshing: PropTypes.bool,
//     moreDataAvailable: PropTypes.bool,
//     data: PropTypes.array,
//     myGamingSessions: PropTypes.array,
//     groupGamingSessions: PropTypes.array
//   };
//   constructor(props) {
//     super(props);
//     this.updateFilter = this.updateFilter.bind(this);
//   }
//
//   componentDidMount() {
//     this.fetchData();
//   }
//
//   updateFilter() {
//     this.props.dispatch(changePage(1));
//     this.setState(
//       {
//         data: [],
//         moreDataAvailable: true
//       },
//       () => {
//         this.fetchData();
//       }
//     );
//   }
//
//   fetchData() {
//     this.props.dispatch(fetchMyGamingSessions());
//   }
//
//   handleRefresh = () => {
//     console.log("handleRefresh Triggered");
//     this.props.dispatch(changePage(1));
//     this.props.dispatch(fetchMyGamingSessions());
//   };
//
//   handleLoadMore = () => {
//     console.log("handleLoadMore Triggered");
//     if (
//       this.props.refreshing === false &&
//       this.props.moreDataAvailable === true
//     ) {
//       console.log("handleLoadMore Activated");
//       this.props.dispatch(changePage(this.props.page + 1));
//       this.props.dispatch(loadMoreGamingSessions(this.searchUrl()));
//     }
//   };
//
//   renderFooter = () => {
//     if (!this.props.moreDataAvailable) {
//       console.log(
//         "In Footer moreDataAvailable: " + this.props.moreDataAvailable
//       );
//       return (
//         <View style={styles.alertView}>
//           <MaterialCommunityIcons
//             name="dots-horizontal"
//             size={24}
//             color={colors.mediumGrey}
//           />
//         </View>
//       );
//     } else {
//       return (
//         <View style={{ paddingVertical: 20 }}>
//           <ActivityIndicator />
//         </View>
//       );
//     }
//   };
//
//   render() {
//     if (this.props.isLoading) {
//       return (
//         <View style={styles.container}>
//           <PreSplash />
//         </View>
//       );
//     }
//
//     return (
//       <FlatList
//         data={this.props.myGamingSessions}
//         renderItem={({ item }) => (
//           <GamingSessionsItem data={item} navigation={this.props.navigation} />
//         )}
//         ListHeaderComponent={this.renderEmpty}
//         extraData={this.props}
//         // Getting errors using game id
//         // keyExtractor={item => item.id}
//         keyExtractor={(item, index) => index}
//         refreshing={this.props.refreshing}
//         onRefresh={this.handleRefresh}
//       />
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   // App container
//
//   content: {
//     flex: 1, // Take up all available space
//     // justifyContent: "center", // Center vertically
//     // alignItems: "center", // Center horizontally
//     backgroundColor: colors.white // Darker background for content area
//   }
// });
//
// const mapStateToProps = state => {
//   const activity = state.search.activity;
//   const gameId = state.search.gameId;
//   const game = state.search.games[gameId] || {};
//   const notFull = state.search.notFull;
//   const page = state.search.page;
//   const platform = state.search.platform;
//   const isLoading = state.gamingSessions.isLoading;
//   const refreshing = state.gamingSessions.refreshing;
//   const moreDataAvailable = state.gamingSessions.moreDataAvailable;
//   const data = state.gamingSessions.gamingSessions;
//   const myGamingSessions = state.gamingSessions.myGamingSessions;
//   const groupGamingSessions = state.gamingSessions.groupGamingSessions;
//
//   const user = state.authentication.user;
//
//   return {
//     activity,
//     game,
//     gameId,
//     page,
//     platform,
//     notFull,
//     isLoading,
//     refreshing,
//     moreDataAvailable,
//     data,
//     myGamingSessions,
//     groupGamingSessions,
//     user
//   };
// };
//
// export default connect(mapStateToProps)(MyGamingSessionsList);
