// @flow
import * as React from "react";
import {StyleSheet, ScrollView} from "react-native";

import {StyleGuide} from "./theme";

import type {StyleProps} from "./theme";

type ContentProps = StyleProps & {
    children: React.Node
};

export default class Content extends React.PureComponent<ContentProps> {

    render(): React.Node {
        const {children, style} = this.props;
        return (
            <ScrollView style={styles.container} contentContainerStyle={style}>
                {children}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: StyleGuide.palette.lightGray
    }
});
