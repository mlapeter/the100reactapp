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
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import Card from "../components/Card";

import { Formik } from "formik";
import * as yup from "yup";
import { form } from "tcomb-form-native/lib";

const FieldWrapper = ({ children, label, formikProps, formikKey }) => {
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

const StyledSwitch = ({ formikKey, formikProps, label, ...rest }) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <Switch
        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value);
          setOtherValues(formikProps, formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  );
};

const setOtherValues = (formikProps, formikKey, value) => {
  if (formikKey === "privateVisible") {
    if (value === true) {
      formikProps.setFieldValue("publicVisible", false);
      formikProps.setFieldValue("groupVisible", false);
      formikProps.setFieldValue("friendsVisible", false);
    } else if (
      !formikProps.values.publicVisible &&
      !formikProps.values.groupVisible &&
      !formikProps.values.friendsVisible
    ) {
      formikProps.setFieldValue("publicVisible", true);
      formikProps.setFieldValue("groupVisible", true);
      formikProps.setFieldValue("friendsVisible", true);
    }
  }
  if (formikKey === "publicVisible" && value === true) {
    formikProps.setFieldValue("groupVisible", true);
    formikProps.setFieldValue("friendsVisible", true);
    formikProps.setFieldValue("privateVisible", false);
  }
  if (formikKey === "groupVisible") {
    if (value === true) {
      formikProps.setFieldValue("privateVisible", false);
    } else if (
      !formikProps.values.publicVisible &&
      !formikProps.values.friendsVisible
    ) {
      formikProps.setFieldValue("privateVisible", true);
    } else {
      formikProps.setFieldValue("publicVisible", false);
    }
  }
  if (formikKey === "friendsVisible") {
    if (value === true) {
      formikProps.setFieldValue("privateVisible", false);
    } else if (
      !formikProps.values.publicVisible &&
      !formikProps.values.groupVisible
    ) {
      formikProps.setFieldValue("privateVisible", true);
    } else {
      formikProps.setFieldValue("publicVisible", false);
    }
  }
};

const validationSchema = yup.object().shape({
  // agreeToTerms: yup
  //   .boolean()
  //   .label("Terms")
  //   .test("is-true", "Must agree to continue.", value => value === true)
});

const signUp = ({ email }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "a@a.com") {
        reject(new Error("nope!"));
      }
      resolve(true);
    }, 1000);
  });
};

export default () => (
  <SafeAreaView style={styles.container}>
    <Card>
      <Text
        style={[
          styles.headline,
          styleSheet.typography["headline"],
          { marginVertical: 20 }
        ]}
      >
        Who Can View/ Join?
      </Text>
      <Formik
        initialValues={{
          publicVisible: true,
          groupVisible: true,
          friendsVisible: true,
          privateVisible: false
        }}
        onSubmit={(values, actions) => {
          signUp({ email: values.email })
            .then(() => {
              alert(JSON.stringify(values));
            })
            .catch(error => {
              actions.setFieldError("general", error.message);
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        validationSchema={validationSchema}
      >
        {formikProps => (
          <React.Fragment>
            <StyledSwitch
              label="Public"
              formikKey="publicVisible"
              formikProps={formikProps}
            />
            <StyledSwitch
              label="Visible to Group"
              formikKey="groupVisible"
              formikProps={formikProps}
            />
            <StyledSwitch
              label="Visible to Friends"
              formikKey="friendsVisible"
              formikProps={formikProps}
            />

            <StyledSwitch
              label="Private"
              formikKey="privateVisible"
              formikProps={formikProps}
            />

            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <React.Fragment>
                <Button
                  title="Create Gaming Session!"
                  onPress={formikProps.handleSubmit}
                />
                <Text style={{ color: "red" }}>
                  {formikProps.errors.general}
                </Text>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Formik>
    </Card>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  loading: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});
