// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import { StyleSheet, SafeAreaView, TextInput, View } from "react-native";
import { observable, action } from "mobx";
import { observer } from "mobx-react/native";

import {
  Feed,
  Container,
  IconButton,
  KeyboardSpacer,
  StyleGuide
} from "../components";
import SocialAPI from "./api";
import { ChatMessage } from "./components";

import type { NavigationProps } from "../components/Navigation";
import type { Message as MessageModel } from "./api";

@observer
export default class Message extends React.Component<
  NavigationProps<{ id: string }>
> {
  @observable message: string;
  @observable messages: MessageModel[] = [];

  @autobind
  @action
  postMessage() {
    this.messages.push({
      id: moment().format("X"),
      me: true,
      message: this.message,
      timestamp: parseInt(moment().format("X"), 10)
    });
    this.message = "";
  }

  @autobind
  @action
  setMessage(message: string) {
    this.message = message;
  }

  @action
  componentDidMount() {
    const { navigation } = this.props;
    const { id } = navigation.state.params;
    this.messages = SocialAPI.messageThread(id).messages;
  }

  @autobind
  renderItem(message: MessageModel): React.Node {
    const { navigation } = this.props;
    const { id } = navigation.state.params;
    return <ChatMessage {...{ id, message }} />;
  }

  render(): React.Node {
    const { renderItem, messages } = this;
    const { navigation } = this.props;
    const { id } = navigation.state.params;
    const thread = SocialAPI.messageThread(id);
    const user = SocialAPI.user(thread.user);
    const back = "Messages";
    const title = user.name;
    return (
      <Container>
        <Feed
          data={messages.slice().reverse()}
          inverted
          {...{ renderItem, back, title, navigation }}
        />
        <SafeAreaView style={styles.inputBox}>
          <View style={styles.innerInputBox}>
            <TextInput
              placeholder="Message"
              underlineColorAndroid="transparent"
              style={styles.input}
              onSubmitEditing={this.postMessage}
              onChangeText={this.setMessage}
              value={this.message}
              blurOnSubmit={false}
            />
            <IconButton
              name="send"
              onPress={this.postMessage}
              backgroundPrimary
              rounded
            />
          </View>
        </SafeAreaView>
        <KeyboardSpacer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: StyleGuide.palette.white
  },
  innerInputBox: {
    padding: StyleGuide.spacing.tiny,
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    backgroundColor: StyleGuide.palette.lightGray,
    flex: 1,
    padding: StyleGuide.spacing.tiny,
    marginRight: StyleGuide.spacing.tiny,
    ...StyleGuide.styles.borderRadius
  }
});
