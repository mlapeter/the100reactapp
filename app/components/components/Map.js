// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {LinearGradient, MapView} from "expo";

import {withTheme} from "./theme";

import type {ThemeProps} from "./theme";
import type {Location, Marker} from "./Model";

const mapStyle = require("../components/mapStyle");

type MapProps = ThemeProps & {
    coordinate: Location,
    markers: Marker[],
    height: number
};

class Map extends React.Component<MapProps> {

    static defaultProps = {
        markers: [],
        height: 320
    };

    map: MapView;

    componentDidMount() {
        const {coordinate} = this.props;
        // eslint-disable-next-line no-undef
        requestAnimationFrame(() => {
            this.map.animateToRegion({
                ...coordinate,
                latitudeDelta: 0.001,
                longitudeDelta: 0.01
            }, 1);
        });
    }

    @autobind
    setMapRef(map: MapView | null) {
        this.map = map;
    }

    render(): React.Node {
        const {markers, height, theme} = this.props;
        return (
            <View style={{ height }}>
                <MapView
                    ref={this.setMapRef}
                    style={{ height }}
                    provider="google"
                    customMapStyle={mapStyle}
                >
                    {
                        markers.map(marker => (
                            <MapView.Marker
                                key={marker.id}
                                coordinate={marker.coordinate}
                                pinColor={theme.palette.primary}
                            />
                        ))
                    }
                </MapView>
                <LinearGradient
                    colors={["rgba(243, 243, 243, 0)", "rgba(243, 243, 243, 1)"]}
                    style={styles.gradient}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gradient: {
        height: 100,
        position: "relative",
        top: -100
    }
});

export default withTheme(Map);
