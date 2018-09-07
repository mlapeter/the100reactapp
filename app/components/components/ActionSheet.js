// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableOpacity, Animated, Dimensions, Platform} from "react-native";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";
import {BlurView} from "expo";
import Modal from "expo/src/modal/Modal";

import {StyleGuide} from "./theme";
import Sheet from "./Sheet";

type ActionSheetProps = {
    title: string,
    subtitle?: string,
    children: React.Node,
    noSafeArea: boolean,
    scrollable: boolean,
    rightAction?: {
        label: string,
        onPress: () => mixed
    }
};

@observer
export default class ActionSheet extends React.Component<ActionSheetProps> {

    static defaultProps = {
        scrollable: false,
        noSafeArea: false,
        subtitle: undefined,
        rightAction: undefined
    };

    @observable animation: Animated.Value = new Animated.Value(0);
    @observable visible = false;

    @action show() { this.visible = true; }
    @action hide() { this.visible = false; }

    @autobind toggle() {
        this.animation.stopAnimation();
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
        Animated.timing(
            this.animation,
            {
                toValue: this.visible ? 1 : 0,
                duration,
                useNativeDriver
            }
        ).start();
    }

    render(): React.Node {
        const {toggle} = this;
        const {title, subtitle, rightAction, children, noSafeArea, scrollable} = this.props;
        const opacity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5]
        });
        const intensity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
        });
        const translateY = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [height, 0]
        });
        return (
            <Modal visible={this.visible} onRequestClose={this.toggle} transparent>
                <View style={styles.modal}>
                    {
                        Platform.OS === "android" && (
                            <Animated.View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    backgroundColor: StyleGuide.palette.black,
                                    opacity
                                }}
                            >
                                <TouchableOpacity style={styles.exit} onPress={this.toggle} />
                            </Animated.View>
                        )
                    }
                    {
                        Platform.OS === "ios" && (
                            <AnimatedBlurView tint="dark" style={StyleSheet.absoluteFill} {...{intensity}}>
                                <TouchableOpacity style={styles.exit} onPress={this.toggle} />
                            </AnimatedBlurView>
                        )
                    }
                    <AnimatedSheet
                        style={{ transform: [{ translateY }] }}
                        {...{toggle, title, subtitle, rightAction, noSafeArea, scrollable}}
                    >
                        {children}
                    </AnimatedSheet>
                </View>
            </Modal>
        );
    }
}

const {height} = Dimensions.get("window");
const duration = 350;
const useNativeDriver = Platform.OS === "android";
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedSheet = Animated.createAnimatedComponent(Sheet);
const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "flex-end"
    },
    exit: {
        flex: 1
    }
});
