// @flow
import * as React from "react";
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";
// import type { StyleProps } from "../../styles";

// type CardProps = {
//   onPress?: () => mixed,
//   children: React.Node,
//   style?: StyleProps
// };



export default class CardToggle extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      displayContent: false
    };
  }

  onToggle = () => {
    this.setState({
      displayContent: !this.state.displayContent
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  };

  render() {
    const { style, header, children } = this.props;
    const { onToggle } = this;

    return (
      <View style={[styles.card, style]}>
        <TouchableOpacity onPress={onToggle}>
          {header}
        </TouchableOpacity>
        {this.state.displayContent && (
          children
        )}
      </View>
    );

  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: styleSheet.spacing.tiny,
    marginHorizontal: styleSheet.spacing.small,
    marginTop: styleSheet.spacing.small,
    marginBottom: 1,
    ...styleSheet.styles.borderRadius,
    ...styleSheet.styles.shadow
  }
});
