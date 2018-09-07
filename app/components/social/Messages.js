// @flow

type Props = {
  notifications: Array<string>,
  dispatch: Function
};

import * as React from "react";
import { Feed } from "../components";
import { Notification } from "./components";
import { connect } from "react-redux";
import { fetchNotifications } from "../../actions/notifications";
import NotificationsItem from "../../components/NotificationsItem/NotificationsItem";

class Messages extends React.Component<Props> {
  componentWillMount() {
    this.props.dispatch(fetchNotifications());
  }

  renderItem(data): React.Node {
    const { id, created_at, message, avatar_url, notification_type } = data;
    return (
      <Notification
        {...{
          message,
          created_at,
          id,
          avatar_url,
          notification_type
        }}
      />
    );
  }

  render(): React.Node {
    const { renderItem } = this;
    const data = this.props.notifications;
    const navigation = this.props.navigation;
    const title = "Notifications";
    return <Feed {...{ data, renderItem, title }} />;
  }
}

const mapStateToProps = state => {
  const notifications = state.notifications.notifications;

  return {
    notifications
  };
};

export default connect(mapStateToProps)(Messages);
