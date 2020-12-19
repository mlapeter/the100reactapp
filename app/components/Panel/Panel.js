import React, { Component } from "react";
import { LayoutAnimation, Text, TouchableHighlight, View } from "react-native";

export default class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfLines: this.props.numberOfLines
    };
  }

  toggle = () => {
    let numberOfLines =
      this.state.numberOfLines === this.props.numberOfLines
        ? 25
        : this.props.numberOfLines;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      numberOfLines: numberOfLines
    });
  };

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
            onPress={() => {
              this.toggle();
            }}
            underlayColor={"transparent"}
          >
            <Text
              style={this.props.style}
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
