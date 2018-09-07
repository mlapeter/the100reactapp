// @flow
import * as React from "react";
import {ScrollView, StyleSheet, View, Animated} from "react-native";
import {observable} from "mobx";
import {observer} from "mobx-react/native";

import NavigationBar from "./NavigationBar";
import Text from "./Text";
import Map from "./Map";
import {withTheme, StyleGuide} from "./theme";

import type {Marker, Location} from "./Model";
import type {ThemeProps} from "./theme";
import type {NavigationProps} from "./Navigation";

type GeoFeedProps<T: Marker> = ThemeProps & NavigationProps<*> & {
    markers: T[],
    renderItem: T => React.Node,
    title: string,
    back?: string,
    defaultCoordinates?: Location
};

@observer
class GeoFeed<T: Marker> extends React.Component<GeoFeedProps<T>> {

    @observable scrollAnimation = new Animated.Value(0);

    listHeaderComponent(): React.Node {
        const {scrollAnimation} = this;
        const {title, theme, markers, defaultCoordinates} = this.props;
        const translateY = scrollAnimation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-1, 0, 0]
        });
        return (
            <Animated.View style={{ transform: [{ translateY }] }}>
                <View style={[{ backgroundColor: theme.palette.primary }, styles.header]}>
                    <Text type="title1" style={styles.headerText}>{title}</Text>
                </View>
                <Map
                    coordinate={defaultCoordinates || { latitude: 47.377343, longitude: 8.535342 }}
                    markers={markers.map(marker => ({ id: marker.id, coordinate: marker.coordinate }))}
                />
            </Animated.View>
        );
    }

    render(): React.Node {
        const {scrollAnimation} = this;
        const {markers, renderItem, title, navigation, back} = this.props;
        const textTranslation = scrollAnimation.interpolate({
            inputRange: [0, 55, 56, 57],
            outputRange: [55, 55, 0, 0]
        });
        const onScroll = Animated.event(
            [{
                nativeEvent: {
                    contentOffset: {
                        y: scrollAnimation
                    }
                }
            }],
            { useNativeDriver: true }
        );
        const titleStyle = { transform: [{ translateY: textTranslation }]};
        return (
            <View style={styles.root}>
                <NavigationBar {...{ navigation, title, titleStyle, back}} />
                <AnimatedScrollView
                    style={styles.list}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    {...{ onScroll }}
                >
                    {this.listHeaderComponent()}
                    {
                        markers.map(marker => (
                            <View key={marker.id} style={styles.item}>{renderItem(marker)}</View>
                        ))
                    }
                </AnimatedScrollView>
            </View>
        );
    }
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    list: {
        backgroundColor: StyleGuide.palette.lightGray
    },
    container: {
    },
    header: {
        padding: StyleGuide.spacing.small
    },
    headerText: {
        color: StyleGuide.palette.white
    },
    item: {
        position: "relative",
        top: -100
    }
});

export default withTheme(GeoFeed);
