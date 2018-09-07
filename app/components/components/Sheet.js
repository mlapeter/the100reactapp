// @flow
import * as React from "react";
import {
    StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Dimensions, SafeAreaView, ScrollView
} from "react-native";
import {Constants} from "expo";

import {StyleGuide, type StyleProps} from "./theme";
import Text from "./Text";
import Icon from "./Icon";

export type SheetProps = StyleProps & {
    title: string,
    subtitle?: string,
    children: React.Node,
    noSafeArea: boolean,
    scrollable: boolean,
    rightAction?: {
        label: string,
        onPress: () => void
    },
    toggle: () => mixed
};

export default class Sheet extends React.PureComponent<SheetProps> {

    static defaultProps = {
        noSafeArea: false,
        scrollable: false
    };

    render(): React.Node {
        const {style, toggle, title, subtitle, rightAction, noSafeArea, scrollable} = this.props;
        const children = noSafeArea ? this.props.children : <SafeAreaView>{this.props.children}</SafeAreaView>;
        return (
            <View style={[styles.content, style]}>
                <TouchableWithoutFeedback onPress={toggle}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.left} onPress={toggle}>
                            <Icon name="arrow-down" primary />
                        </TouchableOpacity>
                        <View style={styles.center}>
                            <Text type="headline" style={styles.title} numberOfLines={1} primary>{title}</Text>
                            {subtitle && (
                                <Text type="footnote" style={styles.title} numberOfLines={1} primary>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        <View style={styles.right}>
                            {
                                rightAction && (
                                    <TouchableOpacity onPress={rightAction.onPress}>
                                        <Text type="headline" primary>{rightAction.label}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {scrollable ? (<ScrollView bounces={false}>{children}</ScrollView>) : children}
            </View>
        );
    }
}

const {height} = Dimensions.get("window");
const styles = StyleSheet.create({
    content: {
        backgroundColor: StyleGuide.palette.white,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        maxHeight: height - Constants.statusBarHeight
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: StyleGuide.spacing.small,
        paddingVertical: StyleGuide.spacing.tiny,
        borderBottomWidth: 1,
        borderColor: StyleGuide.palette.lightGray
    },
    left: {
        width: 36
    },
    center: {
        flex: 1
    },
    title: {
        textAlign: "center"
    },
    right: {
        minWidth: 36,
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});
