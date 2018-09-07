// @flow
import * as React from "react";
import {TouchableOpacity, View} from "react-native";

import {Icon, withStyles, notImplementedYet} from "../../../components";

import type {Theme, StylesProps, StyleSheet} from "../../../components/theme";

type StyleNames = "addStory";

const themedStyles = (theme: Theme): StyleSheet<StyleNames> => ({
    addStory: {
        backgroundColor: theme.palette.secondary,
        height: 48,
        width: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: theme.spacing.small
    }
});

class AddStory extends React.PureComponent<StylesProps<StyleNames>> {

    render(): React.Node {
        const {styles} = this.props;
        return (
            <TouchableOpacity onPress={notImplementedYet}>
                <View style={styles.addStory}>
                    <Icon name="plus" primary />
                </View>
            </TouchableOpacity>
        );
    }
}

export default withStyles(themedStyles, AddStory);
