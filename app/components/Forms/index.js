import React from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Switch,
  StyleSheet
} from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

export const FieldWrapper = ({ children, label, formikProps, formikKey }) => {
  return (
    <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
      <Text
        style={[
          styles.headline,
          styleSheet.typography["headline"],
          { marginBottom: 6 }
        ]}
      >
        {label}
      </Text>
      {children}
      <Text style={{ color: "red" }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );
};

export const FieldWrapperSwitch = ({
  children,
  label,
  formikProps,
  formikKey
}) => {
  return (
    <View
      style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: "row" }}
    >
      {children}
      <Text
        style={[
          styles.headline,
          styleSheet.typography["headline"],
          { marginHorizontal: 15 }
        ]}
      >
        {label}
      </Text>

      <Text style={{ color: "red" }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );
};
