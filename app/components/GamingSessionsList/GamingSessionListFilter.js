import React, { Component, PropTypes } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  TouchableHighlight,
  StyleSheet,
  Text,
  TextInput,
  View,
  Picker,
  PickerIOS,
  Modal,
  Switch
} from "react-native";
import { colors, fontSizes } from "../../styles";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

class GameSelector extends Component {
  constructor(props) {
    super(props);
  }

  onGameSelect(Id) {
    this.props.onGameSelect(Id);
  }

  componentDidMount() {
    this.onGameSelect(this.props.gameType);
  }

  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Text style={styles.defaultText}>Game</Text>
        </View>
        <View style={styles.middleBox}>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.pickerItem}
            selectedValue={this.props.gameType}
            onValueChange={(itemValue, itemIndex) =>
              this.onGameSelect(itemValue)}
          >
            {this.props.gamesData.map(game => (
              <Picker.Item
                key={game.id}
                label={game.name.toString()}
                value={game.id}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

class PlatformSelector extends Component {
  constructor(props) {
    super(props);
  }
  onPlatformSelect(Id) {
    this.props.onPlatformSelect(Id);
  }
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Text style={styles.defaultText}>Platform</Text>
        </View>
        <View style={styles.middleBox}>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.pickerItem}
            selectedValue={this.props.platform}
            onValueChange={(itemValue, itemIndex) =>
              this.onPlatformSelect(itemValue)}
          >
            {this.props.platformData.map(platform => (
              <Picker.Item
                key={platform.toString()}
                label={platform.toString()}
                value={platform.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

class ActivitySelector extends Component {
  constructor(props) {
    super(props);
  }

  onActivitySelect(Id) {
    this.props.onActivitySelect(Id);
  }

  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Text style={styles.defaultText}>Activity</Text>
        </View>
        <View style={styles.middleBox}>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.pickerItem}
            selectedValue={this.props.activity}
            onValueChange={(itemValue, itemIndex) =>
              this.onActivitySelect(itemValue)}
          >
            <Picker.Item key="Any" label="Any" value="Any" />
            {this.props.activities.map(activity => (
              <Picker.Item
                key={activity}
                label={activity.toString()}
                value={activity}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

class NotFullSelector extends Component {
  constructor(props) {
    super(props);
  }
  onNotFullSelect(Id) {
    this.props.onNotFullSelect(Id);
  }
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Text style={styles.defaultText}>Not Full Games</Text>
        </View>
        <View style={styles.middleBox}>
          <Switch
            // style={{width: 100}}
            value={this.props.notFull}
            onValueChange={itemValue => this.onNotFullSelect(itemValue)}
          />
        </View>
      </View>
    );
  }
}

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      platformData: ["xbox-one", "xbox-360", "ps3", "ps4"],
      activities: []
    };
    this.onGameSelect = this.onGameSelect.bind(this);
    this.onPlatformSelect = this.onPlatformSelect.bind(this);
    this.onNotFullSelect = this.onNotFullSelect.bind(this);
    this.onActivitySelect = this.onActivitySelect.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }
  componentDidMount() {}
  setModalVisible(visible) {
    this.setState(
      {
        modalVisible: visible,
        gameType: this.props.gameType,
        platform: this.props.platform,
        activity: this.props.activity,
        notFull: this.props.notFull
      },
      () => {
        //this.setState({ modalVisible: visible });
        console.info(
          "state",
          this.state.gameType,
          this.state.platform,
          this.state.activity,
          this.state.notFull
        );
      }
    );
  }

  onGameSelect(Id) {
    this.setState({ gameType: Id });

    for (var index = 0; index < this.props.gamesData.length; index++) {
      var game = this.props.gamesData[index];
      if (game.id == Id) {
        this.state.activities = game.activities;
      }
    }
  }

  onPlatformSelect(Id) {
    console.info("platform", Id);
    this.setState({ platform: Id });
  }

  onNotFullSelect(Id) {
    console.info("notFull", Id);
    this.setState({ notFull: Id });
  }

  onActivitySelect(Id) {
    console.info("onActivitySelect", Id);
    this.setState({ activity: Id });
  }

  onModalClose() {
    console.info("onModalClose");
    this.props.onFilterUpdate(
      this.state.gameType,
      this.state.platform,
      this.state.activity,
      this.state.notFull
    );

    //this.props.onFilterClose();
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <Text> </Text>
          <GameSelector
            style={{ marginTop: 20 }}
            gamesData={this.props.gamesData}
            onGameSelect={this.onGameSelect}
            gameType={this.state.gameType}
          />
          <PlatformSelector
            platformData={this.state.platformData}
            onPlatformSelect={this.onPlatformSelect}
            platform={this.state.platform}
          />
          <ActivitySelector
            activities={this.state.activities}
            onActivitySelect={this.onActivitySelect}
            activity={this.state.activity}
          />
          <NotFullSelector
            onNotFullSelect={this.onNotFullSelect}
            notFull={this.state.notFull}
          />
          <View>
            <Button
              onPress={() => {
                this.onModalClose();
                this.setModalVisible(!this.state.modalVisible);
              }}
              title="Close Filters"
            />
          </View>
        </Modal>

        <Button
          style={styles.buttonStyle}
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
  defaultText: {
    color: colors.primary,
    fontSize: fontSizes.small,
    fontWeight: "bold",
    paddingTop: 20
  },
  buttonStyle: {
    paddingTop: 10,
    marginTop: 30
  },
  pickerStyle: {
    backgroundColor: colors.lightestGrey,
    flex: 1,
    height: 40
  },
  pickerItem: {
    height: 40,
    color: "black",
    fontSize: fontSizes.small
  },
  box: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    //margin: 2,
    padding: 2,
    borderBottomWidth: 0.2,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  leftBox: {
    flex: 3,
    padding: 2,
    margin: 1,
    backgroundColor: colors.white
  },
  middleBox: {
    flex: 6,
    padding: 2,
    margin: 1,
    backgroundColor: colors.white
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey
  }
});
