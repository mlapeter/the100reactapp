// @flow
import * as React from "react";
import {Platform} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

// eslint-disable-next-line react/prefer-stateless-function
export default class KeyboardSpacerComp extends React.PureComponent<{}> {

    render(): React.Node {
        if (Platform.OS === "ios") {
            return <KeyboardSpacer />;
        }
        return null;
    }
}
