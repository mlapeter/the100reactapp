import React, {Component, PropTypes } from 'react';
import {ActivityIndicator, Button, FlatList, Image, ListView, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import PreSplash from '../../components/PreSplash/PreSplash'
import { colors } from '../../styles'
import Moment from '../../../node_modules/react-moment';
import { FontAwesome } from '@expo/vector-icons';


Moment.globalFormat = 'h:mma';
Moment.globalLocale = 'en';




export default class GamingSessionsList extends React.Component {
  static navigationOptions = {
      title: 'Gaming Sessions',
    };


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    }
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }


  componentDidMount() {
    this.fetchData()



  }

  fetchData() {
    console.log("FETCHING DATA");
  return fetch('http://pwn-staging.herokuapp.com/api/v1/gaming_sessions.json')
    .then((response) => response.json())
    .then((responseJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson),
        isLoading: false,
      }, function() {
        // do something with new state
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <PreSplash />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh}
          />
        }

          dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View style={styles.box}>
                <View style={styles.leftBox}>
                  <Image
          style={styles.avatarMini}
          source={{uri: 'https://pwntastic-avatar-staging.s3.amazonaws.com/uploads/user/avatar/11869/main_mikelapeter.jpg'}}
        />
                </View>
                <View style={styles.middleBox}>
                  <Text style={styles.gamingSessionTitle}>
                    <Moment element={ Text }>{rowData.start_time}</Moment> {rowData.category}
                  </Text>
                  <Text numberOfLines={1}>
                    {rowData.name}
                  </Text>
                </View>
                <View style={styles.rightBox}>
                  <Text><FontAwesome name="users" size={12} color={colors.grey} /> {rowData.primary_users_count}/{rowData.team_size}</Text>
                  <Text><FontAwesome name="plus" size={12} color={colors.grey} />{rowData.light_level === null ? " any" : rowData.light_level}</Text>
                </View>
              </View>
              }
        />
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
