// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { colors, fontSizes, fontStyles, styleSheet } from "../styles";
import TopNav from "../components/TopNav/TopNav";
import ImageCard from "../components/ImageCard";
import defaultUserHeaderBackground from "../assets/images/d2-all.jpg";

type GroupsProps = {
  name?: string
};

class Groups extends React.Component<GroupsProps<>> {
  @autobind
  renderItem(group: string): React.Node {
    const navigation = this.props.navigation;
    let picture =
      group.header_background_image_api === "img/default-group-header.jpg"
        ? defaultUserHeaderBackground
        : { uri: picture };

    return (
      <ImageCard
        title={group.item.name}
        picture={defaultUserHeaderBackground}
        heightRatio={0.4}
        onPress={() => navigation.navigate("Group", { groupId: group.item.id })}
        back={"Groups"}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TopNav
          title="Groups"
          user={this.props.user}
          navigation={this.props.navigation}
        />
        <FlatList
          data={this.props.groups}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.props.isLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: styleSheet.spacing.small,
    backgroundColor: colors.lightGray
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  }
});

const mapStateToProps = state => {
  const groups = state.users.currentUser.groups;
  const isLoading = state.group.isLoading;
  const user = state.authentication.user;

  return {
    groups,
    isLoading,
    groupsError: state.group.error,
    user
  };
};

export default connect(mapStateToProps)(connectAlert(Groups));
