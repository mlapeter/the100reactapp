import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

import moment from "moment";
import "moment-timezone";

const TimeAgo = ({ date, ...rest }) => {
  return (
    <Text {...rest}>
      {moment(date).calendar({
        sameElse: "L [at] LT"
      })}
    </Text>
  );
};

TimeAgo.propTypes = {
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default TimeAgo;
