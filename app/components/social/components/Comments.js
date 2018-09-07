// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {Text, StyleGuide, Avatar} from "../../components";

import SocialAPI from "../api";

import type {User} from "../api";

export default class Comments extends React.Component<{ comments: string[], showLabel: boolean }> {

    static defaultProps = {
        showLabel: true
    }

    render(): React.Node {
        const {comments, showLabel} = this.props;
        const users: User[] = comments.slice(0, 3).map(id => SocialAPI.user(id));
        const left = users.length === 0 ? 0 : ((-5 * (users.length - 1)) + StyleGuide.spacing.tiny);
        return (
            <View style={styles.comments}>
                {
                    users.map((user, index) => (
                        <Avatar
                            key={user.id}
                            uri={user.picture}
                            stacked={!!index}
                            style={this.computedStyle(index, users.length)}
                        />
                    ))
                }
                {
                    showLabel && <Text type="footnote" style={{ left }}>{`${comments.length} comments`}</Text>
                }
            </View>
        );
    }

    computedStyle(index: number, length: number): { left: number} {
        const {showLabel} = this.props;
        if (showLabel) {
            return { left: -5 * index };
        }
        return { left: 5 * (length - index - 1) };
    }
}

const styles = StyleSheet.create({
    comments: {
        flexDirection: "row",
        alignItems: "center"
    }
});
