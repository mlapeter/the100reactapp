import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

import moment from "moment";
import "moment-timezone";


class TimeAgo extends PureComponent {

  render() {
    return <Text {...this.props.rest}> {moment(this.props.date).fromNow()}</Text >;
  }
};

TimeAgo.propTypes = {
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default TimeAgo;
