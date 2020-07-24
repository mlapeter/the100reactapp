import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from "react-native";
import PropTypes from "prop-types";
import { colors, fontSizes, fontStyles } from "../../styles";

var SCREEN_HEIGHT = Dimensions.get("window").height;
var noop = () => { };
// var ds = new FlatList.Data({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class ListPopover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // dataSource: ds.cloneWithRows(this.props.list)
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      // this.setState({ dataSource: ds.cloneWithRows(nextProps.list) });
    }
  }
  handleClick = data => {
    this.props.onClick(data);
    this.props.onClose();
  };



  renderItem = rowData => {
    var separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    var rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    var separator = <View style={separatorStyle} />;
    if (rowData === this.props.list[0]) {
      separator = null;
    }

    var row = <Text style={rowTextStyle}>{rowData}</Text>;
    if (this.props.renderRow) {
      row = this.props.renderRow(rowData);
    }

    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowData)}>
          {row}
        </TouchableOpacity>
      </View>
    );
  };


  renderList = () => {
    var styles = this.props.style || DefaultStyles;
    var maxHeight = {};
    if (this.props.list.length > 12) {
      maxHeight = { height: (SCREEN_HEIGHT * 3) / 4 };
    }
    return (
      <FlatList
        style={maxHeight}
        data={this.props.list}
        renderItem={({ item }) => (
          this.renderItem(item)
        )}
        automaticallyAdjustContentInsets={false}
      />
    );
  };
  render() {
    var containerStyle = this.props.containerStyle || DefaultStyles.container;
    var popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose} style={containerStyle}>
          <View style={popoverStyle}>{this.renderList()}</View>
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  }
}
ListPopover.propTypes = {
  list: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func
};
ListPopover.defaultProps = {
  list: [""],
  isVisible: false,
  onClick: noop,
  onClose: noop
};
const DefaultStyles = StyleSheet.create({
  container: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignSelf: "stretch",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  popover: {
    margin: 10,
    borderRadius: 3,
    padding: 3,
    backgroundColor: colors.white
  },
  rowText: {
    padding: 10
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#CCC"
  }
});
