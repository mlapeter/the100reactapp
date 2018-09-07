// @flow
import * as React from "react";
import {StyleSheet, View, SafeAreaView} from "react-native";
import {LinearGradient} from "expo";

import {StyleGuide} from "./theme";

type FooterProps = {
    children: React.Node
};

export default class Footer extends React.PureComponent<FooterProps> {

    render(): React.Node {
        const {children} = this.props;
        const justifyContent = React.Children.count(children) === 1 ? "flex-end" : "space-between";
        return (
            <LinearGradient colors={["transparent", "black"]}>
                <SafeAreaView>
                    <View style={[styles.footer, { justifyContent }]}>
                        {children}
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        paddingHorizontal: StyleGuide.spacing.small,
        paddingVertical: StyleGuide.spacing.small
    }
});
