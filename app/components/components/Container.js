// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

type ContainerProps = {
    children: React.Node
};

export default class Container extends React.PureComponent<ContainerProps> {

    render(): React.Node {
        return (
            <View style={styles.container}>{this.props.children}</View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
