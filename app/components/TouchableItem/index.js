import React, { Children, PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import Touchable from "react-native-platform-touchable";

export default class TouchableItem extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  static defaultProps = {
    useForeground: false
  };

  render() {
    let { children, useForeground, ...rest } = this.props;

    let foreground = null;
    let background = Touchable.Ripple("rgba( 0, 0, 0, 0.32 )", true);
    if (useForeground) {
      foreground = background;
      background = null;
    }

    return (
      <Touchable {...rest} background={background} foreground={foreground}>
        {Children.only(children)}
      </Touchable>
    );
  }
}
