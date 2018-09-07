// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {FontAwesome as Icon} from "@expo/vector-icons";

import {withTheme, type ThemeProps, type StyleProps} from "./theme";

type RatingCompProps = ThemeProps & StyleProps & {
    name: string,
    ratings: number,
    total: number,
    white: boolean
};

class RatingComp extends React.PureComponent<RatingCompProps> {

    static defaultProps = {
        name: "star",
        total: 5,
        white: false
    };

    render(): React.Node {
        const {theme, ratings, name, total, white} = this.props;
        const size = 20;
        const {primary, secondary} = theme.palette;
        const filledStars = ratings - (ratings % 1);
        const halfStar = ratings % 1 !== 0;
        const style = styles.icon;
        return (
            <View style={[styles.row, this.props.style]}>
                {
                    repeat(total).map(key => (
                        <Icon
                            name={white ? "star-o" : name}
                            color={white ? "white" : secondary}
                            {...{size, style, key}}
                        />
                    ))
                }
                <View style={[styles.row, StyleSheet.absoluteFill]}>
                    {
                        repeat(filledStars).map(key => (
                            <Icon color={white ? "white" : primary} {...{size, key, style, name}} />
                        ))
                    }
                    {
                        halfStar && name === "star" && (
                            <Icon name="star-half" color={white ? "white" : primary} {...{size, style}} />
                        )
                    }
                </View>
            </View>
        );
    }
}

const repeat = (length: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < length; i += 1) {
        numbers.push(i);
    }
    return numbers;
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row"
    },
    icon: {
        margin: 1
    }
});

export default withTheme(RatingComp);
