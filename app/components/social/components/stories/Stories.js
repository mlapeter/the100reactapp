// @flow
import * as React from "react";
import {StyleSheet, ScrollView} from "react-native";

import SocialAPI from "../../api";

import Story from "./Story";
import AddStory from "./AddStory";

import type {NavigationProps} from "../../../components/Navigation";

export default class Stories extends React.PureComponent<NavigationProps<>> {

    render(): React.Node {
        const {navigation} = this.props;
        const {stories} = SocialAPI;
        return (
            <ScrollView contentContainerStyle={styles.stories} horizontal>
                <AddStory />
                {
                    stories.map(story => {
                        const user = SocialAPI.user(story.user);
                        return (
                            <Story
                                key={story.id}
                                uri={user.picture}
                                read={story.read}
                                id={story.id}
                                {...{navigation}}
                            />
                        );
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    stories: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 80
    }
});
