import PropTypes from "prop-types";

export const ChatMessagePropType = {
  key: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};
