// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {StyleGuide} from "./theme";

type ListProps<T> = {
    rows: T[],
    renderRow: (T, number) => React.Node
};

export default class List<T> extends React.PureComponent<ListProps<T>> {

    render(): React.Node {
        const {rows, renderRow} = this.props;
        return (
            <View style={styles.container}>
                {
                    rows.map((row, index) => (
                        <View key={index} style={index !== (rows.length - 1) ? styles.separator : {}}>
                            {renderRow(row, index)}
                        </View>
                    ))
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: StyleGuide.palette.white,
        ...StyleGuide.styles.borderRadius
    },
    separator: {
        ...StyleGuide.styles.separator
    }
});
