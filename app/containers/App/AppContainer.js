import React, {Component, PropTypes } from 'react';
import {Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation';


import PreSplash from '../../components/PreSplash/PreSplash'
import Splash from '../../components/Splash/Splash'
import SplashContainer from '../../containers/Splash/SplashContainer'
import GamingSessionsList from '../../components/GamingSessionsList/GamingSessionsList'
import { colors } from '../../styles'


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };



  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      isAuthenticating: true
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    })
  }

  render() {
      // const { navigate } = this.props.navigation;

      return (
        <View style={styles.container}>
          {/* <Button
    onPress={() => navigate('Games')}
    title="Press Me"
  /> */}
           {this.state.isAuthenticating === true
            ? <SplashContainer />
            : <GamingSessionsList />}
        </View>
      );




  }
}


export default AppContainer = TabNavigator({
  Home: { screen: HomeScreen },
  Games: {screen: GamingSessionsList},
  SplashContainer: {screen: SplashContainer}
});

const styles = StyleSheet.create({
  container: {
  marginTop: 20,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: colors.white,
},
})

// function mapStateToProps ({authentication}) {
//   return {
//     isAuthenticating: authentication.isAuthenticating,
//   }
// }
//
//
// export default connect(
//   mapStateToProps
//
// )(AppContainer)
