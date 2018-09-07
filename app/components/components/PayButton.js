// @flow
import * as React from "react";
import {StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback, View} from "react-native";
import {Ionicons as Icon} from "@expo/vector-icons";

import Text from "./Text";
import {StyleGuide} from "./theme";
import {notImplementedYet} from "./notImplementedYet";

// eslint-disable-next-line react/prefer-stateless-function
export default class PayButton extends React.PureComponent<{}> {

    render(): React.Node {
        const Button = Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
        const name = Platform.OS === "ios" ? "logo-apple" : "logo-android";
        const color = "white";
        return (
            <Button onPress={notImplementedYet}>
                <View style={styles.button} >
                    <Icon {...{name, color}} size={28} style={styles.icon} />
                    <Text {...{color}}>Pay</Text>
                </View>
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        ...StyleGuide.styles.shadow,
        ...StyleGuide.styles.button,
        backgroundColor: StyleGuide.palette.black,
        marginBottom: 0
    },
    icon: {
        ...StyleGuide.styles.buttonIcon
    }
});
