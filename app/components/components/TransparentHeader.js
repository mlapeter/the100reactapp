// @flow
import * as React from "react";
import {StyleSheet, View, SafeAreaView} from "react-native";
import {LinearGradient} from "expo";

import {StyleGuide} from "./theme";

type TransparentHeaderProps = {
    children: React.Node
};

export default class TransparentHeader extends React.PureComponent<TransparentHeaderProps> {

    render(): React.Node {
        const {children} = this.props;
        return (
            <LinearGradient colors={["black", "transparent"]}>
                <SafeAreaView>
                    <View style={styles.header}>
                        {children}
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        marginVertical: StyleGuide.spacing.small,
        marginHorizontal: StyleGuide.spacing.tiny,
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
