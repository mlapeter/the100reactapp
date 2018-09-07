// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import Icon, {type IconName} from "./Icon";
import Text from "./Text";
import {StyleGuide} from "./theme";

type Detail = {
    icon?: IconName,
    comp?: React.Node,
    caption: string
};

type DetailsBarProps = {
    details: Detail[]
};

export default class DetailsBar extends React.PureComponent<DetailsBarProps> {

    render(): React.Node {
        return (
            <View style={styles.details}>
                {
                    this.props.details.map((detail, key) => (
                        <View style={styles.item} {...{key}}>
                            <View style={styles.icon}>
                                {detail.icon && <Icon name={detail.icon} primary />}
                                {detail.comp}
                            </View>
                            <Text
                                type="caption"
                                style={styles.caption}
                                primary
                            >
                                {detail.caption}
                            </Text>
                        </View>
                    ))
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    details: {
        flexDirection: "row",
        zIndex: 100,
        ...StyleGuide.styles.shadow
    },
    item: {
        flex: 1,
        alignItems: "center",
        padding: StyleGuide.spacing.small
    },
    icon: {
        height: 30,
        justifyContent: "center"
    },
    caption: {
        marginTop: StyleGuide.spacing.tiny
    }
});
