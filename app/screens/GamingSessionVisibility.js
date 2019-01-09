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
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";
import { setGamingSessionVisibility } from "../actions/gamingSessions";
import Card from "../components/Card";
import { FieldWrapper } from "../components/Forms";

import { Formik } from "formik";
import * as yup from "yup";

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

class GamingSessionVisibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.props.navigation.state.params &&
        this.props.navigation.state.params.gamingSessionId ? (
          <View style={styles.logoutContainer}>
            <Button
              style={{
                height: 25,
                width: 180,
                marginBottom: 25
              }}
              onPress={() =>
                this.props.navigation.navigate({
                  routeName: "GamingSessionEdit",
                  params: {
                    confirmDelete: true
                  }
                })
              }
              title="Delete"
            />
          </View>
        ) : null}
        <Card>
          <Text
            style={[
              styles.headline,
              styleSheet.typography["headline"],
              { marginVertical: 20, textAlign: "center" }
            ]}
          >
            Who Can View This Gaming Session?
          </Text>
          <Formik
            initialValues={
              this.props.navigation.state.params &&
              this.props.navigation.state.params.gamingSessionId
                ? {
                    publicVisible: this.props.gamingSession.public_visible,
                    groupVisible: this.props.gamingSession.group_visible,
                    friendsVisible: this.props.gamingSession.friends_visible,
                    privateVisible: this.props.gamingSession.private_visible
                  }
                : {
                    publicVisible: true,
                    groupVisible: true,
                    friendsVisible: true,
                    privateVisible: false
                  }
            }
            onSubmit={(values, actions) => {
              this.props.dispatch(setGamingSessionVisibility(values));
              if (
                this.props.navigation.state.params &&
                this.props.navigation.state.params.gamingSessionId
              ) {
                this.props.navigation.navigate("GamingSessionEdit");
              } else {
                this.props.navigation.navigate("GamingSessionCreate");
              }
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
                  label="My Group"
                  formikKey="groupVisible"
                  formikProps={formikProps}
                />
                <StyledSwitch
                  label="My Friends"
                  formikKey="friendsVisible"
                  formikProps={formikProps}
                />

                <StyledSwitch
                  label="Private/ Unlisted"
                  formikKey="privateVisible"
                  formikProps={formikProps}
                />

                <React.Fragment>
                  <Button
                    title="Next &raquo;"
                    onPress={formikProps.handleSubmit}
                  />
                  <Text style={{ color: "red" }}>
                    {formikProps.errors.general}
                  </Text>
                </React.Fragment>
              </React.Fragment>
            )}
          </Formik>
        </Card>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10
  }
});

const mapStateToProps = state => {
  const user = state.users.currentUser;
  const gamingSession = state.gamingSessions.gamingSession;

  return {
    user,
    gamingSession
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSessionVisibility));
