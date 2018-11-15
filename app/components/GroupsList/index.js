// @flow
import * as React from "react";
import { FlatList, Image, View } from "react-native";
import { type NavigationScreenProp } from "react-navigation";
import ImageCard from "../ImageCard";
import defaultUserHeaderBackground from "../../assets/images/d2-all.jpg";

type Item = {
  item: Group
};

type Group = {
  id: number,
  name: string,
  header_background_image_api: string
};

type GroupsListProps = {
  groups?: Array<Group>,
  navigation: NavigationScreenProp<{}>
};

export default class GroupsList extends React.Component<GroupsListProps> {
  renderItem = ({ item }: Item) => (
    <ImageCard
      title={item.name}
      picture={
        item.header_background_image_api === "img/default-group-header.jpg"
          ? defaultUserHeaderBackground
          : { uri: item.header_background_image_api }
      }
      heightRatio={0.4}
      onPress={() =>
        this.props.navigation.navigate("Group", { groupId: item.id })
      }
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.groups}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        // refreshing={this.props.isLoading}
      />
    );
  }
}
