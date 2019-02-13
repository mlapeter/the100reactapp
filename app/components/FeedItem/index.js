import React, { PureComponent } from "react";
import PropTypes from 'prop-types'
import styles from "./styles";
import Card from "../Card";
import FeedImage from "../FeedImage";
import Header from "./Header";
import FeedBody from "./FeedBody";
import Footer from "./Footer";



class FeedItem extends PureComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeable: PropTypes.bool,
    imageUrl: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    iframeSrc: PropTypes.string,
    iframeHeight: PropTypes.number,
    navigation: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired
  }



  render() {
    if (this.props.item.item_type) {
      return (
        <FeedCard
          navigation={this.props.navigation}
          item={this.props.item}
          imageUrl={this.props.imageUrl}
          iframeSrc={this.props.iframeSrc}
          iframeHeight={this.props.iframeHeight}
          currentUser={this.props.user}
          likeable={this.props.likeable}
          navigateTo={this.props.navigateTo}
        />
      );

    }
  }
}

class FeedCard extends PureComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    imageUrl: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    iframeSrc: PropTypes.string,
    iframeHeight: PropTypes.number,
    currentUser: PropTypes.object.isRequired,
    likeable: PropTypes.bool,
    navigation: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired
  }


  navigateTo = () => {
    this.props.navigateTo(this.props.item)
  }



  render() {

    return (
      <Card
        style={styles.card}
        item={this.props.item}
        navigation={this.props.navigation}
        onPress={this.navigateTo}
      >
        <Header
          author_avatar_url={this.props.item.author_avatar_url}
          title={this.props.item.title}
          author_gamertag={this.props.item.author_gamertag}
          created_at={this.props.item.created_at} />
        <FeedImage item={this.props.item} imageUrl={this.props.imageUrl} />
        <FeedBody item={this.props.item} iframeSrc={this.props.iframeSrc} iframeHeight={this.props.iframeHeight} />
        {this.props.item.item_type != "player-left-game" && !this.props.item.body.includes("twitter.com") &&
          <Footer
            item={this.props.item}
            currentUser={this.props.currentUser}
            likeable={this.props.likeable}
            navigation={this.props.navigation}
          />
        }
      </Card>
    );
  }
};




export default FeedItem

