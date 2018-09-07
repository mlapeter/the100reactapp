// @flow
import * as React from "react";
import {StyleSheet, View, Dimensions} from "react-native";
import {LinearGradient} from "expo";

import Image from "./Image";
import Text from "./Text";
import {StyleGuide} from "./theme";

import type {Picture} from "./Model";

type HeaderProps = {
    picture: Picture,
    title?: string,
    children?: React.Node,
    heightRatio: number
};

export default class Header extends React.PureComponent<HeaderProps> {

    static defaultProps = {
        heightRatio: 0.68,
        title: undefined,
        children: undefined
    }

    render(): React.Node {
        const {picture, title, children, heightRatio} = this.props;
        return (
            <View style={{ height: width * heightRatio }}>
                <Image style={styles.image} {...picture} />
                <LinearGradient
                    style={styles.gradient}
                    colors={["rgba(0,0,0,0.8)", "transparent", "rgba(0,0,0,0.8)"]}
                >
                    {children}
                    { title && <Text type="title1" color="white" style={styles.text}>{title}</Text> }
                </LinearGradient>
            </View>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    image: {
        ...StyleSheet.absoluteFillObject
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "space-between"
    },
    text: {
        padding: StyleGuide.spacing.small
    }
});
