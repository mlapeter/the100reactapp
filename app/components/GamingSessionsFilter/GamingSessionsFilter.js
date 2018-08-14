import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Modal
} from "react-native";
import { colors, fontSizes } from "../../styles";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";

import { changePlatform } from "../../actions/search";
import { changeGame } from "../../actions/search";
import { changeActivity, toggleNotFull } from "../../actions/search";
import { connect } from "react-redux";
import { ButtonGroup, CheckBox } from "react-native-elements";
import { AsyncStorage } from "react-native";

class GamingSessionsFilter extends Component {
  static propTypes = {
    activities: PropTypes.array,
    activity: PropTypes.string,
    game: PropTypes.object,
    gameId: PropTypes.number,
    platform: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedIndex: 1,
      platforms: ["xbox-one", "ps4", "pc"]
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    platform = this.state.platforms[selectedIndex];
    this.props.dispatch(changePlatform(platform));
    this.setState({ selectedIndex: selectedIndex });
    AsyncStorage.setItem("search_platform", platform);
  }

  updateFilter() {
    // Off for debugging
    // this.fetchData();
    // this.setState(
    //   {
    //     data: [],
    //     moreDataAvailable: true
    //   },
    //   () => {
    //     this.fetchData();
    //   }
    // );
  }

  componentWillMount() {}

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    if (this.props.loading) {
      return null;
    }

    const { selectedIndex } = this.state;

    return (
      <View style={{ paddingTop: 0 }}>
        <Modal
          animationType={"slide"}
          // transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed using android back button.");
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.white
            }}
          >
            <View
              style={{
                width: 300,
                marginTop: 60,
                // height: 600,
                backgroundColor: colors.white
              }}
            >
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={this.state.selectedIndex}
                buttons={this.state.platforms}
                containerStyle={{ height: 60 }}
              />

              <CheckBox
                title="Games that aren't full"
                checked={this.props.notFull === 1}
                onPress={() =>
                  this.props.dispatch(
                    toggleNotFull(this.props.notFull === 1 ? 0 : 1)
                  )}
              />

              {/* <Button
                raised
                icon={{ name: "home", size: 32 }}
                buttonStyle={{ backgroundColor: "red", borderRadius: 10 }}
                textStyle={{ textAlign: "center" }}
                title={`Welcome to\nReact Native Elements`}
              /> */}

              {/* <Picker
                style={styles.pickerStyle}
                selectedValue={this.props.platform}
                onValueChange={platform => {
                  this.props.dispatch(changePlatform(platform));
                }}
              >
                <Picker.Item label="Xbox One" value="xbox-one" />
                <Picker.Item label="PS4" value="ps4" />
              </Picker> */}

              <Picker
                style={styles.pickerStyle}
                selectedValue={this.props.activity}
                onValueChange={activity =>
                  this.props.dispatch(changeActivity(activity))}
              >
                <Picker.Item label="All" value="" />
                {this.props.activities.map(activity => (
                  <Picker.Item
                    key={activity.toString()}
                    label={activity.toString()}
                    value={activity.toString()}
                  />
                ))}
              </Picker>
              <Picker
                style={styles.pickerStyle}
                selectedValue={this.props.gameId}
                onValueChange={gameId => {
                  this.props.dispatch(changeGame(gameId));
                }}
              >
                {this.props.games.map(game => (
                  <Picker.Item
                    key={game.id}
                    label={game.name.toString()}
                    value={game.id}
                  />
                ))}
              </Picker>

              <View style={styles.modalButtonStyle}>
                <Button
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                  title="Cancel"
                />
                <Button
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    this.props.updateFilter();
                  }}
                  title="Search"
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* <Button
          style={styles.modalButtonStyle}
          onPress={() => {
            this.setModalVisible(true);
          }}
          title="Search Options"
        /> */}

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Icon name="md-search" size={24} color={colors.mediumGrey} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: colors.white
  },
  // pickerStyle: {
  //   padding: 10,
  //   marginBottom: 20
  // }
  modalButtonStyle: {
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    justifyContent: "space-around",
    alignItems: "stretch",
    flexDirection: "row"
  }
});

const mapStateToProps = state => {
  const platform = state.search.platform;
  const gameId = state.search.gameId;
  const games = state.search.games;
  const activities = state.search.activities;
  const activity = state.search.activity;
  const notFull = state.search.notFull;

  return {
    platform,
    gameId,
    games,
    activities,
    activity,
    notFull
  };
};

export default connect(mapStateToProps)(GamingSessionsFilter);
