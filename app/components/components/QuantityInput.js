// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {action, observable} from "mobx";
import {observer} from "mobx-react/native";

import Button from "./Button";
import Text from "./Text";
import {withTheme, StyleGuide} from "./theme";

import type {ThemeProps} from "./theme";

type QuantityInputProps = ThemeProps & {
    singular: string,
    plural: string,
    from: number,
    to: number
};

@observer
class QuantityInput extends React.Component<QuantityInputProps> {

    @observable quantity: number = 1;
    @autobind @action increment() { this.quantity += 1; }
    @autobind @action decrement() { this.quantity -= 1; }

    render(): React.Node {
        const {singular, plural, from, to, theme} = this.props;
        return (
            <View style={[styles.container, { backgroundColor: theme.palette.secondary }]}>
                <Button
                    icon="minus"
                    secondary
                    style={styles.leftButton}
                    disabled={this.quantity === from}
                    onPress={this.decrement}
                />
                <Text primary>{`${this.quantity} ${this.quantity > 1 ? plural : singular}`}</Text>
                <Button
                    icon="plus"
                    secondary
                    style={styles.rightButton}
                    disabled={this.quantity === to}
                    onPress={this.increment}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: StyleGuide.spacing.small,
        ...StyleGuide.styles.borderRadius
    },
    leftButton: {
        marginBottom: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    rightButton: {
        marginBottom: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    }
});

export default withTheme(QuantityInput);
