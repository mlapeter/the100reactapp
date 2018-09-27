// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { FlatList, Image, View } from "react-native";

import ImageCard from "../ImageCard";
import defaultUserHeaderBackground from "../../assets/images/d2-all.jpg";

type GroupsListProps = {
  groups?: array
};

export default class GroupsList extends React.Component<GroupsListProps<>> {
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
      />
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.groups}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={this.props.isLoading}
      />
    );
  }
}
