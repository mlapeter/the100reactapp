import React, { Children, PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Vibration } from "react-native";
import Touchable from "react-native-platform-touchable";

export default class TouchableItem extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    useForeground: PropTypes.bool,
    noVisualFeedback: PropTypes.bool,
    vibrate: PropTypes.bool,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func
  };

  static defaultProps = {
    useForeground: false,
    noVisualFeedback: false,
    vibrate: false
  };

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  onLongPress = () => {
    if (this.props.onLongPress) {
      if (this.props.vibrate) {
        Vibration.vibrate(20);
      }
      this.props.onLongPress();
    }
  };

  render() {
    let {
      children,
      useForeground,
      noVisualFeedback,
      vibrate,
      ...rest
    } = this.props;

    let foreground = null;
    let background = null;
    if (!noVisualFeedback) {
      background = Touchable.Ripple("rgba( 0, 0, 0, 0.32 )", true);
    }
    if (useForeground) {
      foreground = background;
      background = null;
    }

    return (
      <Touchable
        {...rest}
        background={background}
        foreground={foreground}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        {Children.only(children)}
      </Touchable>
    );
  }
}
