import React from "react";
import { Animated, View, StyleSheet, Text } from "react-native";
import { colors } from "../../styles";

export default class PreSplash extends React.Component {
  static navigationOptions = {
    title: "PreSplash"
  };

  state = {
    rotation: new Animated.Value(0)
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(this.state.rotation, { toValue: -1, duration: 150 }),
        Animated.timing(this.state.rotation, { toValue: 1, duration: 150 }),
        Animated.timing(this.state.rotation, { toValue: 0, duration: 250 })
      ]).start();
    }, 1000);
  }

  UNSAFE_componentWillMount() {
    window.clearInterval(this.interval);
  }

  getTransform() {
    return {
      transform: [
        {
          rotate: this.state.rotation.interpolate({
            inputRange: [-1, 1],
            outputRange: ["-20deg", "20deg"]
          })
        }
      ]
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.image, this.getTransform()]}
          source={require("../../assets/images/logo.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    resizeMode: "contain",
    height: 300
  }
});
