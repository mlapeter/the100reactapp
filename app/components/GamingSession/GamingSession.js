import React, {Component, PropTypes } from 'react';
import {ActivityIndicator, Alert, Button, Image, ListView, StyleSheet, Text, TextInput, View } from 'react-native';

import PreSplash from '../../components/PreSplash/PreSplash'
import { colors } from '../../styles'
import Moment from '../../../node_modules/react-moment';
import { FontAwesome } from '@expo/vector-icons';


Moment.globalFormat = 'h:mma';
Moment.globalLocale = 'en';



export default class GamingSession extends React.Component {
  static navigationOptions = {
      title: 'Gaming Sessions',
    };


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      gameData: ''
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    return fetch('http://pwn-staging.herokuapp.com/api/v1/gaming_sessions/' + this.props.navigation.state.params.gamingSessionId + '.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>Test</Text>
        <Text>{params.gamingSessionId}</Text>
        <Text>Gaming Session: {this.state.dataSource[0]}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white,
  },
  container: {
  marginTop: 20,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: colors.white,
},
loading: {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
},
box: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  margin: 5,
  padding: 5,
  borderBottomWidth: 0.5,
  borderBottomColor: '#d6d7da',
  backgroundColor: colors.white,
},
leftBox: {
  flex: 1,
  padding: 2,
  margin: 2,
  backgroundColor: colors.white,
},
middleBox: {
  flex: 6,
  padding: 2,
  margin: 2,
  backgroundColor: colors.white,
},
rightBox: {
  flex: 1,
  padding: 2,

},
avatarMini: {
  height:40,
  width:40,
  borderRadius: 20,
},
gamingSessionTitle: {
  color: colors.grey,
  fontFamily: 'Futura',
}
})
