// @flow
import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { colors, fontSizes, fontStyles, styleSheet } from "../../styles";

type TabButtonsProps = {
  values: string[],
  selectedIndex: number,
  onChange: number => mixed,
  transparent?: boolean
};

class TabButtons extends React.PureComponent<TabButtonsProps> {
  render(): React.Node {
    const { values, transparent, selectedIndex, onChange } = this.props;
    return (
      <View style={styles.container}>
        {values.map((value, key) => {
          const isFirst = key === 0;
          const isLast = key === values.length - 1;
          const isSelected = key === selectedIndex;
          let color: string;
          let backgroundColor: string;
          if (isSelected) {
            color = "white";
          } else if (transparent) {
            color = "black";
          } else {
            color = colors.primary;
          }
          if (isSelected) {
            if (transparent) {
              backgroundColor = "rgba(0, 0, 0, 0.5)";
            } else {
              backgroundColor = colors.primary;
            }
          } else if (transparent) {
            backgroundColor = "rgba(255, 255, 255, 0.5)";
          } else {
            backgroundColor = colors.secondary;
          }
          const style = [styles.control, { backgroundColor }];
          if (isFirst) {
            style.push(styles.first);
          } else if (isLast) {
            style.push(styles.last);
          }
          if (isSelected) {
            return (
              <View {...{ style, key }}>
                <Text style={{ color }}>{value}</Text>
              </View>
            );
          }
          return (
            <TouchableOpacity onPress={() => onChange(key)} {...{ key, style }}>
              <Text style={{ color }}>{value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    ...styleSheet.styles.barHeight
  },
  control: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  first: {
    ...styleSheet.styles.borderRadius,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  last: {
    ...styleSheet.styles.borderRadius,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  }
});

export default TabButtons;
