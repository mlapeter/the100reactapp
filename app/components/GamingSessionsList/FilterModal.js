import React, { Component, PropTypes } from "react";
import { Button, StyleSheet, Text, View, Picker, Modal } from "react-native";
import { colors, fontSizes } from "../../styles";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { changePlatform } from "../../redux/modules/search";

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      platform: this.props.platform,
      gameId: this.props.gameId,
      activities: [],
      activity: this.props.activity
    };
  }

  componentDidMount() {
    this.updateGameActivities(this.state.gameId);
  }

  updateGameActivities(gameId) {
    console.log("Updating Game Activities");
    this.setState({ gameId: gameId }, () => {
      for (var index = 0; index < this.props.gamesData.length; index++) {
        var game = this.props.gamesData[index];
        if (game.id == this.state.gameId) {
          this.setState({
            activities: game.activities
          });
        }
      }
    });
  }

  setModalVisible(visible) {
    console.log("Modal Activity: " + this.state.activity);
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    if (this.props.loading) {
      return null;
    }

    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed using android back button.");
          }}
        >
          <View style={styles.modalContainer}>
            <Picker
              style={styles.pickerStyle}
              selectedValue={this.state.platform}
              onValueChange={platform => {
                console.log(changePlatform(platform));
              }}
            >
              <Picker.Item label="Xbox One" value="xbox-one" />
              <Picker.Item label="PS4" value="ps4" />
            </Picker>
            <Picker
              style={styles.pickerStyle}
              selectedValue={this.state.gameId.toString()}
              onValueChange={gameId => this.updateGameActivities(gameId)}
            >
              <Picker.Item label="Destiny" value="1" />
              <Picker.Item label="Destiny 2" value="23" />
            </Picker>

            <Picker
              style={styles.pickerStyle}
              selectedValue={this.state.activity}
              onValueChange={activity => this.setState({ activity: activity })}
            >
              <Picker.Item label="Any" value="" />
              {this.state.activities.map(activity =>
                <Picker.Item
                  key={activity}
                  label={activity.toString()}
                  value={activity}
                />
              )}
            </Picker>
            <View style={styles.modalButtonStyle}>
              <Button
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  this.props.updateFilter(
                    this.state.platform,
                    this.state.gameId,
                    this.state.activity
                  );
                }}
                title="Search"
              />
            </View>
          </View>
        </Modal>

        <Button
          onPress={() => {
            this.setModalVisible(true);
          }}
          title="Show Filters"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10,
    marginBottom: 10,
    justifyContent: "space-around",
    backgroundColor: colors.white
  },
  pickerStyle: {
    padding: 10,
    marginBottom: 20
  },
  modalButtonStyle: {
    padding: 20,
    margin: 20
  }
});
