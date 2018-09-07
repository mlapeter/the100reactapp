// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";

import {StyleGuide, withTheme} from "../../../components";

import type {StyleProps, ThemeProps} from "../../../components/theme";

type NotificationDotProps = StyleProps & ThemeProps;

class NotificationDot extends React.PureComponent<NotificationDotProps> {

    render(): React.Node {
        const {style, theme} = this.props;
        const backgroundColor = theme.palette.primary;
        return (
            <View style={[styles.dot, { backgroundColor }, style]} />
        );
    }
}

const styles = StyleSheet.create({
    dot: {
        width: 12,
        height: 12,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: StyleGuide.palette.white
    }
});

export default withTheme(NotificationDot);
