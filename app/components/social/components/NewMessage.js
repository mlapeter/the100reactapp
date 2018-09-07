// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";
import {StyleSheet, TextInput, View} from "react-native";

import {StyleGuide, SegmentedControl, KeyboardSpacer} from "../../components";

@observer
export default class NewMessage extends React.Component<{}> {

    @observable selectedIndex = 0;

    @autobind @action
    onChange(index: number) {
        this.selectedIndex = index;
    }

    render(): React.Node {
        const {selectedIndex, onChange} = this;
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Share a message"
                    underlineColorAndroid="transparent"
                    textAlignVertical="top"
                    multiline
                    autoFocus
                />
                <SegmentedControl values={["Text", "Photo"]} {...{selectedIndex, onChange}} />
                <KeyboardSpacer />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: StyleGuide.spacing.base
    },
    textInput: {
        height: 143,
        ...StyleGuide.typography.body
    }
});
