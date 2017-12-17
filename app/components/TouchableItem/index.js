import React, { Component, Children } from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from "react-native";

import * as android from "android-versions";

const TouchableItem = ({ children, style, ...rest }) => {
  if (Platform.OS == "android" && Platform.Version >= android.LOLLIPOP.api) {
    return (
      <TouchableNativeFeedback
        {...rest}
        background={TouchableNativeFeedback.Ripple(
          "rgba( 0, 0, 0, 0.32 )",
          true
        )}
      >
        <View style={style}>{Children.only(children)}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity {...rest} style={style}>
        {Children.only(children)}
      </TouchableOpacity>
    );
  }
};

export default TouchableItem;
