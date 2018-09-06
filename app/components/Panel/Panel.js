import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AsyncStorage,
  Button,
  Image,
  LayoutAnimation,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import { colors, fontSizes, fontStyles } from "../../styles";

export default class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // expanded: false,
      // animation: new Animated.Value(),
      numberOfLines: this.props.numberOfLines
    };
  }
  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    });
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
    // this.state.animation.setValue(event.nativeEvent.layout.height);
  }

  toggle() {
    let numberOfLines =
      this.state.numberOfLines === this.props.numberOfLines
        ? 25
        : this.props.numberOfLines;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState({
      numberOfLines: numberOfLines
    });
  }

  render() {
    return (
      <View
        style={{
          margin: 5,
          overflow: "hidden"
        }}
      >
        <View>
          <TouchableHighlight
            onPress={this.toggle.bind(this)}
            underlayColor={colors.white}
          >
            <Text
              style={styles.description}
              numberOfLines={this.state.numberOfLines}
            >
              {this.props.text}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 5
  },

  title: {
    padding: 5,
    color: colors.grey,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
  },
  description: {
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  }
});
