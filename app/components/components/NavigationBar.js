// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {SafeAreaView, View, Animated, StyleSheet} from "react-native";
import {LinearGradient} from "expo";

import type {____ViewStyleProp_Internal as Style} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

import LeftAction from "./LeftAction";
import Text from "./Text";
import IconButton from "./IconButton";
import {withTheme, StyleGuide} from "./theme";

import type {ThemeProps} from "./theme";
import type {NavigationProps} from "./Navigation";
import type {Action} from "./Model";

type NavigationBarType = "opaque" | "transparent";

type NavigationBarProps = ThemeProps & NavigationProps<*> & {
    title: string,
    subtitle?: string,
    type: NavigationBarType,
    titleStyle?: Style,
    back?: string,
    rightAction?: Action,
    withGradient: boolean,
    expanded: boolean,
    largeTitle: boolean
};

class NavigationBar extends React.Component<NavigationBarProps> {

    static defaultProps = {
        type: "opaque",
        title: "",
        withGradient: false,
        expanded: false
    };

    @autobind
    goBack() {
        const {navigation} = this.props;
        navigation.goBack();
    }

    render(): React.Node {
        const {
            type, title, subtitle, theme, back, titleStyle, rightAction, withGradient, expanded, largeTitle
        } = this.props;
        const block = { flex: largeTitle ? 2 : 1 };
        const containerStyle = {
            backgroundColor: type === "opaque" ? theme.palette.primary : "transparent"
        };
        const navBar = (
            <SafeAreaView style={containerStyle}>
                <View style={styles.content}>
                    <View style={[styles.leftBlock]}>
                        {back && <LeftAction onPress={this.goBack} name="arrow-left" label={back} />}
                    </View>
                    {
                        (title !== "" && !expanded) && (
                            <View style={block}>
                                <AnimatedText
                                    type="headline"
                                    color="white"
                                    align="center"
                                    style={titleStyle}
                                    numberOfLines={1}
                                >
                                    {title}
                                </AnimatedText>
                                {
                                    subtitle && (
                                        <Text
                                            type="footnote"
                                            color="white"
                                            align="center"
                                            numberOfLines={1}
                                        >
                                            {subtitle}
                                        </Text>
                                    )
                                }
                            </View>
                        )
                    }
                    <View style={styles.rightBlock}>
                        {
                            rightAction && (
                                <IconButton
                                    onPress={rightAction.onPress}
                                    name={rightAction.icon}
                                    style={styles.rightAction}
                                />
                            )
                        }
                    </View>
                </View>
                {
                    expanded && (
                        <View style={[{ backgroundColor: theme.palette.primary }, styles.header]}>
                            <Text type="title1" color="white">{title}</Text>
                        </View>
                    )
                }
            </SafeAreaView>
        );
        if (withGradient) {
            return (
                <LinearGradient colors={["black", "transparent"]}>
                    {navBar}
                </LinearGradient>
            );
        }
        return navBar;
    }
}

const styles = StyleSheet.create({
    content: {
        ...StyleGuide.styles.barHeight,
        flexDirection: "row",
        alignItems: "center"
    },
    leftBlock: {
        flex: 1
    },
    rightBlock: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    header: {
        padding: StyleGuide.spacing.small
    },
    rightAction: {
        marginRight: StyleGuide.spacing.small
    }
});

const AnimatedText = Animated.createAnimatedComponent(Text);
export default withTheme(NavigationBar);
