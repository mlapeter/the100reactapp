// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";

import {Feed} from "../components";

import SocialAPI from "./api";
import {Message} from "./components";

import type {NavigationProps} from "../components";
import type {MessageThread} from "./api";

export default class Messages extends React.Component<NavigationProps<>> {

    @autobind
    renderItem(thread: MessageThread): React.Node {
        const {navigation} = this.props;
        const {user, id} = thread;
        const {timestamp, message} = _.last(thread.messages);
        return <Message {...{ user, message, timestamp, id, navigation}} />;
    }

    render(): React.Node {
        const {renderItem} = this;
        const {navigation} = this.props;
        const data = SocialAPI.messages;
        const title = "Messages";
        return (
            <Feed {...{data, renderItem, title, navigation}} />
        );
    }
}
