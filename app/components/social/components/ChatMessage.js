// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {BaseCard, Text, Avatar, StyleGuide} from "../../components";
import SocialAPI from "../api";

import type {Message} from "../api";

type ChatMessageProps = {
    id: string,
    message: Message
};

export default class ChatMessage extends React.PureComponent<ChatMessageProps> {

    render(): React.Node {
        const {id, message} = this.props;
        const {messages} = SocialAPI.messageThread(id);
        const nextMessage = messages.filter((m, i) => i - 1 >= 0 && messages[i - 1].id === message.id)[0];
        const flexDirection = message.me ? "row-reverse" : "row";
        const showAvatar = !nextMessage || (message.me ? !nextMessage.me : nextMessage.me);
        const user = message.me ? SocialAPI.me() : SocialAPI.user(SocialAPI.messageThread(id).user);
        return (
            <View style={{ flexDirection, marginBottom: StyleGuide.spacing.small }}>
                <View style={styles.user}>
                    {showAvatar && <Avatar size={48} uri={user.picture} />}
                </View>
                <BaseCard style={styles.baseCard}>
                    <Text>{message.message}</Text>
                </BaseCard>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    baseCard: {
        minHeight: 48,
        justifyContent: "center",
        flex: 1,
        marginTop: 0
    },
    user: {
        width: 80,
        justifyContent: "flex-end"
    }
});
