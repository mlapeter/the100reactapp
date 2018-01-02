import React, { Component } from "react";
import {
  StyleSheet, // CSS-like styles
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View // Container component
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, fontSizes } from "../../styles";

export default class Tabs extends Component {
  // Initialize State
  state = {
    // First tab is active by default
    activeTab: 0
  };

  // Pull children out of props passed from App component
  render({ children } = this.props) {
    return (
      <View style={styles.container}>
        {/* Tabs row */}
        <View style={styles.tabsContainer}>
          {/* Pull props out of children, and pull title out of props */}
          {children.map(({ props: { title } }, index) => (
            <TouchableOpacity
              style={[
                // Default style for every tab
                styles.tabContainer,
                // Merge default style with styles.tabContainerActive for active tab
                index === this.state.activeTab ? styles.tabContainerActive : []
              ]}
              // Change active tab
              onPress={() => this.setState({ activeTab: index })}
              // Required key prop for components generated returned by map iterator
              key={index}
            >
              <Text
                style={[
                  styles.tabText,
                  index === this.state.activeTab ? styles.tabTextActive : []
                ]}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.contentContainer}>
          {children[this.state.activeTab]}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Component container
  container: {
    flex: 1 // Take up all available space
  },
  // Tabs row container
  tabsContainer: {
    flexDirection: "row" // Arrange tabs in a row
    // paddingTop: 30 // Top padding
  },
  // Individual tab container
  tabContainer: {
    flex: 1, // Take up equal amount of space for each tab
    paddingVertical: 15, // Vertical padding
    borderBottomWidth: 3, // Add thick border at the bottom
    borderBottomColor: "transparent" // Transparent border for inactive tabs
  },
  // Active tab container
  tabContainerActive: {
    borderBottomColor: colors.grey // White bottom border for active tabs
  },
  // Tab text
  tabText: {
    color: colors.lightGrey,
    fontFamily: "Nunito",
    fontWeight: "bold",
    textAlign: "center"
  },
  tabTextActive: {
    color: colors.grey
  },
  // Content container
  contentContainer: {
    flex: 1 // Take up all available space
  }
});
