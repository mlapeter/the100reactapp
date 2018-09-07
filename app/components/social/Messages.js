// @flow

type Props = {
  notifications: Array<string>,
  dispatch: Function
};

import autobind from "autobind-decorator";
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

  @autobind
  renderItem(data): React.Node {
    const { navigation } = this.props;
    const {
      id,
      created_at,
      message,
      avatar_url,
      notification_type,
      target_url_app
    } = data;
    return (
      <Notification
        {...{
          message,
          created_at,
          id,
          avatar_url,
          notification_type,
          target_url_app,
          navigation
        }}
      />
    );
  }

  render(): React.Node {
    const { renderItem } = this;
    const data = this.props.notifications;
    const navigation = this.props.navigation;
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
