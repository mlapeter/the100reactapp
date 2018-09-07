// @flow
import * as React from "react";
import {type NavigationNavigatorProps, type NavigationScreenProp} from "react-navigation";

import TabBar from "./TabBar";
import type {Tabs} from "./TabBar";

export type NavigationProps<P: {} = {}> = NavigationNavigatorProps<{}, { params: P, index: number }>;
export type OptionalNavigationProps = {
    navigation?: NavigationScreenProp<*>
};

export const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

export const animationEnabled = true;

export const TabNavigatorOptions = (tabs: Tabs) => ({
    animationEnabled,
    // eslint-disable-next-line react/display-name
    tabBarComponent: ({ navigation }: NavigationProps<>) => <TabBar {...{navigation, tabs}} />,
    tabBarPosition: "bottom",
    swipeEnabled: false
});
