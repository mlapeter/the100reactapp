// @flow
import * as React from "react";
import {StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, View} from "react-native";

import Icon, {type IconName} from "./Icon";
import Text from "./Text";
import {withTheme, StyleGuide} from "./theme";

import type {ThemeProps, StyleProps} from "./theme";

type ButtonProps = ThemeProps & StyleProps & {
    onPress: () => mixed,
    primary?: boolean,
    secondary?: boolean,
    label?: string,
    icon?: IconName,
    disabled?: boolean,
    primaryTextColor?: boolean
};

class Button extends React.PureComponent<ButtonProps> {

    render(): React.Node {
        const {
            onPress, style, label, icon, primary, secondary, theme, primaryTextColor, disabled
        } = this.props;
        const opacity = disabled ? 0.5 : 1;
        let color: string;
        let backgroundColor: string;
        if (primary) {
            backgroundColor = theme.palette.primary;
        } else if (secondary) {
            backgroundColor = theme.palette.secondary;
        } else {
            backgroundColor = "transparent";
        }
        if (primary) {
            color = "white";
        } else if (secondary) {
            color = theme.palette.primary;
        } else if (primaryTextColor) {
            color = theme.palette.primary;
        } else {
            color = StyleGuide.palette.darkGray;
        }
        const shadow = primary ? StyleGuide.styles.shadow : {};
        let Btn: React.ComponentType<*>;
        if (disabled) {
            Btn = View;
        } else if (Platform.OS === "ios") {
            Btn = TouchableOpacity;
        } else {
            Btn = TouchableNativeFeedback;
        }
        return (
            <Btn {...{onPress}}>
                <View style={[styles.button, { ...shadow, backgroundColor, opacity }, style]} >
                    {icon && <Icon name={icon} style={styles.icon} {...{color}} />}
                    {label && <Text type="headline" {...{color}}>{label}</Text>}
                </View>
            </Btn>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        ...StyleGuide.styles.button
    },
    icon: {
        ...StyleGuide.styles.buttonIcon
    }
});

export default withTheme(Button);
