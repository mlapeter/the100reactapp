import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import * as Font from 'expo-font'

class AlertProvider extends Component {
  static childContextTypes = {
    alertWithType: PropTypes.func,
    alert: PropTypes.func
  };

  static propTypes = {
    children: PropTypes.any
  };

  getChildContext() {
    return {
      alert: (...args) => this.dropdown.alert(...args),
      alertWithType: (...args) => this.dropdown.alertWithType(...args)
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {React.Children.only(this.props.children)}
        <DropdownAlert
          ref={ref => {
            this.dropdown = ref;
          }}
          tapToCloseEnabled={true}
        />
      </View>
    );
  }
}

export default AlertProvider;
