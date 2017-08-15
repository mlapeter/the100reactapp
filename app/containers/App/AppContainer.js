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
  static propTypes = {
    // isAuthenticating: PropTypes.bool.isRequired
  }


  static navigationOptions = {
    title: 'Welcome',
  };



  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    })
  }

  render() {
      return (
        <View style={styles.container}>

           {this.props.isAuthenticating === false
            ? <SplashContainer />
            : <GamingSessionsList />}
        </View>
      );




  }
}

// export default AppContainer = TabNavigator

const AppContainer = TabNavigator({
  Home: { screen: HomeScreen },
  GamingSessionsList: {screen: GamingSessionsList},
  SplashContainer: {screen: SplashContainer}
}, {
  lazy: false,
  animationEnabled: true,
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

function mapStateToProps ({authentication}) {
  return {
    isAuthenticating: authentication.isAuthenticating,
  }
}

export default connect(
  mapStateToProps
)(AppContainer)
