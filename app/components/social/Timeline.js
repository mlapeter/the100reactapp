// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet} from "react-native";

import {Feed, ActionSheet, notImplementedYet} from "../components";

import SocialAPI from "./api";
import {Post, Stories, NewMessage} from "./components";

import type {Post as PostModel} from "./api";
import type {NavigationProps} from "../components";

const renderItem = (post: PostModel): React.Node => <Post {...{post}} />;

export default class Timeline extends React.Component<NavigationProps<>> {

    @autobind
    onPress() {
        this.newPost.toggle();
    }

    newPost: ActionSheet;

    @autobind
    newPostRef(newPost: ActionSheet | null) {
        if (newPost) {
            this.newPost = newPost;
        }
    }

    render(): React.Node {
        const {onPress} = this;
        const {navigation} = this.props;
        const data = SocialAPI.posts;
        const title = "Timeline";
        const rightAction = {
            icon: "write",
            onPress
        };
        const postAction = {
            label: "Post",
            onPress: notImplementedYet
        };
        return (
            <View style={styles.container}>
                <Feed
                    header={<Stories {...{navigation}} />}
                    {...{data, renderItem, title, navigation, rightAction}}
                />
                <ActionSheet title="New Post" ref={this.newPostRef} rightAction={postAction}>
                    <NewMessage />
                </ActionSheet>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
