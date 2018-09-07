// @flow
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback, SafeAreaView} from "react-native";
import {StackActions} from "react-navigation";

import Icon, {type IconName} from "./Icon";
import {StyleGuide} from "./theme";

import type {NavigationProps} from "./Navigation";

export type Tab = {
    key: string,
    label: string,
    icon: IconName
};

export type Tabs = Tab[];

export type TabBarProps = NavigationProps<> & {
    tabs: Tabs
};

export default class TabBar extends React.Component<TabBarProps> {

    navigate(key: string) {
        const {tabs, navigation} = this.props;
        const activeKey = tabs[navigation.state.index].key;
        if (activeKey !== key) {
            navigation.navigate(key);
        } else {
            navigation.dispatch(StackActions.pop({ n: 1 }));
        }
    }

    render(): React.Node {
        const {tabs, navigation} = this.props;
        const activeKey = tabs[navigation.state.index].key;
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.tabs}>
                    {
                        tabs.map(tab => (
                            <TouchableWithoutFeedback key={tab.key} onPress={() => this.navigate(tab.key)}>
                                <View style={styles.tab}>
                                    <Icon name={tab.icon} primary={activeKey === tab.key} />
                                </View>
                            </TouchableWithoutFeedback>
                        ))
                    }
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        ...StyleGuide.styles.shadow,
        elevation: 0
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "stretch",
        ...StyleGuide.styles.barHeight
    },
    tab: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
});
