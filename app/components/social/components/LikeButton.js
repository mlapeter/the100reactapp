// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";

import {IconButton} from "../../components";
import {withTheme} from "../../components/theme";

import type {ThemeProps} from "../../components/theme";

@observer
class LikeButton extends React.Component<ThemeProps> {

    @observable liked = false;
    @autobind @action onPress() { this.liked = !this.liked; }

    render(): React.Node {
        const {liked, onPress} = this;
        const {theme} = this.props;
        return (
            <IconButton name="heart" color={liked ? theme.palette.primary : theme.palette.darkGray} {...{onPress}} />
        );
    }
}

export default withTheme(LikeButton);
