// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";

import { Feed } from "../components";

import SocialAPI from "./api";
// import { Message } from "./components";

import { Notification } from "./components";

import type { NavigationProps } from "../components";
// import type { MessageThread } from "./api";

import { connect } from "react-redux";
import { fetchNotifications } from "../../actions/notifications";
import NotificationsItem from "../../components/NotificationsItem/NotificationsItem";

class Messages extends React.Component<NavigationProps<>> {
  componentWillMount() {
    this.props.dispatch(fetchNotifications());
  }

  @autobind
  renderItem(data: MessageThread): React.Node {
    const { navigation } = this.props;
    const { id, created_at, message, avatar_url, notification_type } = data;
    console.log("DATA");
    console.log(data);
    return (
      <Notification
        {...{
          message,
          created_at,
          id,
          avatar_url,
          navigation,
          notification_type
        }}
      />
    );
  }

  render(): React.Node {
    const { renderItem } = this;
    const { navigation } = this.props;
    // const data = SocialAPI.messages;
    const data = this.props.notifications;

    // const data = [
    //   {
    //     id: "fc2c3317-d525-4af0-91f9-1c6a0dd937d3",
    //     avatar_url:
    //       "https://pwntastic-avatar-production.s3.amazonaws.com/uploads/user/avatar/69551/main_IMG_0043.JPG",
    //     message: "Hey there 🙋🏼‍♀️\nAre you still game for tonight?",
    //     created_at: 1515694896
    //   },
    //   {
    //     id: "d53c6fc8-0bae-48b4-8f72-76dd1c82454f",
    //     avatar_url:
    //       "https://pwntastic-avatar-production.s3.amazonaws.com/uploads/user/avatar/69551/main_IMG_0043.JPG",
    //     message: "Yes, see you at the show!",
    //     created_at: 1515698496
    //   }
    // ];

    const title = "Notifications";
    return <Feed {...{ data, renderItem, title, navigation }} />;
  }
}

const mapStateToProps = state => {
  const notifications = state.notifications.notifications;

  return {
    notifications
  };
};

export default connect(mapStateToProps)(Messages);
