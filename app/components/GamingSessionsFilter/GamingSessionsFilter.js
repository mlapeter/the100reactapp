import React, { Component, PropTypes } from "react";
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
import { changePlatform } from "../../actions/search";
import { changeGame } from "../../actions/search";
import { changeActivity } from "../../actions/search";
import { connect } from "react-redux";
import { ButtonGroup } from "react-native-elements";

class GamingSessionsFilter extends Component {
  static propTypes = {
    activities: PropTypes.array,
    activity: PropTypes.string,
    game: PropTypes.object,
    gameId: PropTypes.string,
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
      <View style={{ marginTop: 20 }}>
        <Modal
          animationType={"slide"}
          transparent={true}
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
                marginTop: 20,
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
                selectedValue={this.props.gameId.toString()}
                onValueChange={gameId => {
                  this.props.dispatch(changeGame(gameId));
                }}
              >
                <Picker.Item label="Destiny" value="1" />
                <Picker.Item label="Destiny 2" value="23" />
              </Picker>
              <View style={styles.modalButtonStyle}>
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
          style={styles.optionContainer}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons
            name="settings"
            size={24}
            color={colors.mediumGrey}
          />
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
    margin: 20
  }
});

const mapStateToProps = state => {
  const platform = state.search.platform;
  const gameId = state.search.gameId;
  const game = state.search.games[gameId] || {};
  const activities = game.activities || {};
  const activity = state.search.activity;

  return {
    platform,
    gameId,
    activities,
    activity
  };
};

export default connect(mapStateToProps)(GamingSessionsFilter);
