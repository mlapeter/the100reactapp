// @flow
import * as React from "react";
import {TouchableOpacity, View} from "react-native";

import Icon, {type IconName} from "./Icon";
import {withTheme} from "./theme";

import type {ThemeProps, StyleProps} from "./theme";

type IconButtonProps = StyleProps & ThemeProps & {
    onPress: () => mixed,
    name: IconName,
    color: string,
    primary: boolean,
    secondary: boolean,
    backgroundPrimary: boolean,
    rounded: boolean,
    disabled: boolean
};

class IconButton extends React.PureComponent<IconButtonProps> {

    static defaultProps = {
        color: "white",
        backgroundPrimary: false,
        primary: false,
        secondary: false,
        rounded: false,
        disabled: false
    }

    render(): React.Node {
        const {
            onPress, name, theme, backgroundPrimary, primary, secondary, rounded, color: defaultColor, disabled
        } = this.props;
        const style = [{ opacity: disabled ? 0.5 : 1 }];
        if (rounded) {
            style.push({
                borderRadius: 14,
                width: 28,
                height: 28,
                justifyContent: "center",
                alignItems: "center"
            });
        }
        if (backgroundPrimary) {
            style.push({
                backgroundColor: theme.palette.primary
            });
        }
        let color: string;
        if (primary) {
            color = theme.palette.primary;
        } else if (secondary) {
            color = theme.palette.secondary;
        } else {
            color = defaultColor;
        }
        style.push(this.props.style);
        const Btn = disabled ? View : TouchableOpacity;
        return (
            <Btn {...{onPress}}>
                <View {...{style}}>
                    <Icon {...{name, color}} />
                </View>
            </Btn>
        );
    }
}

export default withTheme(IconButton);
