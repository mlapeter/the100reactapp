import React, {Component, PropTypes } from 'react';
import {StyleSheet, View } from 'react-native';
// import PreSplash from './app/components/PreSplash/PreSplash'
// import Splash from './app/components/Splash/Splash'
import SplashContainer from '../../containers/Splash/SplashContainer'
import GamingSessionList from '../../components/GamingSessionsList/GamingSessionsList'
import { colors } from '../../styles'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <SplashContainer />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <GamingSessionList />
      </View>
    );
  }
}

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
