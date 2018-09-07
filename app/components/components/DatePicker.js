// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {View} from "react-native";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";
import RNDatePicker from "react-native-datepicker";

import {withStyles, StyleGuide} from "./theme";

import type {Theme, StyleSheet, StylesProps} from "./theme";

type StyleNames = "button" | "datePicker" | "dateInput" | "dateText" | "dateTouchBody" | "btnTextConfirm"
 | "btnTextCancel";

const themedStyles = (theme: Theme): StyleSheet<StyleNames> => ({
    button: {
        backgroundColor: theme.palette.secondary,
        ...StyleGuide.styles.button
    },
    datePicker: {
        ...StyleGuide.styles.barHeight,
        flex: 1
    },
    dateInput: {
        borderWidth: 0
    },
    dateText: {
        ...theme.typography.body,
        color: theme.palette.primary,
        shadowOpacity: 0
    },
    dateTouchBody: {
        flex: 1
    },
    btnTextConfirm: {
        color: theme.palette.primary,
        height: 20
    },
    btnTextCancel: {
        height: 20
    }
});

@observer
class DatePicker extends React.Component<StylesProps<StyleNames>> {

    @observable date: string = moment().format("MMMM Do");
    @autobind @action onDateChange(date: string) { this.date = date; }

    render(): React.Node {
        const {styles} = this.props;
        return (
            <View style={styles.button}>
                <RNDatePicker
                    mode="date"
                    style={styles.datePicker}
                    customStyles={styles}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    format="MMMM Do"
                    showIcon={false}
                    date={this.date}
                    onDateChange={this.onDateChange}
                />
            </View>
        );
    }
}

export default withStyles(themedStyles, DatePicker);
