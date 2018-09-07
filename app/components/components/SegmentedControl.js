// @flow
import * as React from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";

import Text from "./Text";
import {StyleGuide, withTheme} from "./theme";

import type {ThemeProps} from "./theme";

type SegmentedControlProps = ThemeProps & {
    values: string[],
    selectedIndex: number,
    onChange: number => mixed,
    transparent?: boolean
};

class SegmentedControl extends React.PureComponent<SegmentedControlProps> {

    render(): React.Node {
        const {theme, values, transparent, selectedIndex, onChange} = this.props;
        return (
            <View style={styles.container}>
                {
                    values.map((value, key) => {
                        const isFirst = key === 0;
                        const isLast = key === (values.length - 1);
                        const isSelected = key === selectedIndex;
                        let color: string;
                        let backgroundColor: string;
                        if (isSelected) {
                            color = "white";
                        } else if (transparent) {
                            color = "black";
                        } else {
                            color = theme.palette.primary;
                        }
                        if (isSelected) {
                            if (transparent) {
                                backgroundColor = "rgba(0, 0, 0, 0.5)";
                            } else {
                                backgroundColor = theme.palette.primary;
                            }
                        } else if (transparent) {
                            backgroundColor = "rgba(255, 255, 255, 0.5)";
                        } else {
                            backgroundColor = theme.palette.secondary;
                        }
                        const style = [styles.control, { backgroundColor }];
                        if (isFirst) {
                            style.push(styles.first);
                        } else if (isLast) {
                            style.push(styles.last);
                        }
                        if (isSelected) {
                            return (
                                <View {...{style, key}}>
                                    <Text style={{ color }}>{value}</Text>
                                </View>
                            );
                        }
                        return (
                            <TouchableOpacity onPress={() => onChange(key)} {...{key, style}}>
                                <Text style={{ color }}>{value}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        ...StyleGuide.styles.barHeight
    },
    control: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    first: {
        ...StyleGuide.styles.borderRadius,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    last: {
        ...StyleGuide.styles.borderRadius,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    }
});

export default withTheme(SegmentedControl);
