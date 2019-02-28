import * as React from "react";
import { FlatList, Image, View } from "react-native";
import { type NavigationScreenProp } from "react-navigation";
import ImageCard from "../ImageCard";

export default class GamesList extends React.Component {
  componentDidMount() {
    console.log("GAMES LIST MOUNTED")
  }
  renderItem = ({ item }: Item) => (
    <ImageCard
      picture={{ uri: item.computed_main_image }}
      heightRatio={0.4}
      onPress={() =>
        this.props.selectGame(item.id)
      }
      topGradientTransparency={["transparent", "transparent"]}
    />
  );

  render() {
    console
    return (
      <FlatList
        data={this.props.games}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}
