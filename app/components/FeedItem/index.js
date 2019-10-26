import React, { PureComponent } from "react";
import PropTypes from 'prop-types'
import styles from "./styles";
import Card from "../Card";
import FeedImage from "../FeedImage";
import Header from "./Header";
import FeedBody from "./FeedBody";
import Footer from "./Footer";

import defaultGroupHeaderBackground from "../../assets/images/d2-all.jpg";
import hunterHeader from "../../assets/images/d2-hunter.jpg";
import titanHeader from "../../assets/images/d2-titan.jpg";
import warlockHeader from "../../assets/images/d2-warlock.jpg";
import defaultGamingSessionHeaderBackground from "../../assets/images/bungie-placeholder.jpg";



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
    navigateTo: PropTypes.func
  }

  clickable(item) {
    const notClicableItems = ["gaming-session-deleted"]
    if (notClicableItems.includes(item.item_type) || item.body.includes("iframe")) {
      return false
    } else {
      return true
    }
  }

  likeable(item) {
    const likeableItems = ["user-generated", "moment", "first-member-game", "player-joined-game", "new-group-member", "first-member-game", "group-announcement", "game-announcement", "gaming-session-announcement", "global-announcement"]
    if (likeableItems.includes(item.item_type) && item.related_users) {
      return true
    } else {
      return false
    }
  }

  iframeSrc(item) {
    if (item.body && item.body.includes("iframe")) {
      if (item.body.match('src="(.*?)" ')) {
        return String(item.body.match('src="(.*?)" ').pop());
      }
    } else if (item.body && !item.body.includes("iframe") && item.body.includes("xboxdvr.com")) {
      return item.body;
    } else {
      return null
    }
  }

  iframeHeight(item) {
    if (item.body && item.body.includes("iframe") && item.body.match('height="(.*?)" ')) {
      return Number(item.body.match('height="(.*?)" ').pop());
    } else if (item.body && !item.body.includes("iframe") && item.body.includes("xboxdvr.com")) {
      return 260
    } else {
      return 300
    }
  }

  computedImageUrl(item) {
    if (item.image_url) {
      return this.computedPicture(item.image_url)
    } else {
      return null
    }
  }

  computedPicture(url) {
    if (url === "https://www.the100.io/d2-all.jpg") {
      return defaultGroupHeaderBackground;
    } else if (url === "img/default-gaming-session-header.jpg") {
      return defaultGamingSessionHeaderBackground;
    } else if (url === "https://www.the100.io/d2-hunter.jpg") {
      return hunterHeader;
    } else if (url === "https://www.the100.io/d2-titan.jpg") {
      return titanHeader;
    } else if (url === "https://www.the100.io/d2-warlock.jpg") {
      return warlockHeader;
    } else {
      return { uri: url };
    }
  }

  navigateTo = (item) => {
    if (item.item_type && item.item_type == "gaming-session-deleted") {
      null
    } else if (item.data && item.data["group_id"]) {
      this.props.navigation.navigate("Group", {
        groupId: item.data["group_id"]
      });
    } else if (item.data && item.data["gaming_session_id"]) {
      this.props.navigation.navigate("GamingSession", {
        gamingSessionId: item.data["gaming_session_id"]
      });
    } else if (item.data && item.data["user_id"]) {
      this.props.navigation.navigate("Friend", {
        userId: item.author_user_id
      });
    }
  }


  render() {
    const { item } = this.props;
    if (this.props.item.item_type) {
      return (
        <FeedCard
          navigation={this.props.navigation}
          item={item}
          likeable={this.likeable(item)}
          imageUrl={this.computedImageUrl(item)}
          iframeSrc={this.iframeSrc(item)}
          iframeHeight={this.iframeHeight(item)}
          navigateTo={this.clickable(item) ? this.navigateTo : null}

          // imageUrl={this.props.imageUrl}
          // iframeSrc={this.props.iframeSrc}
          // iframeHeight={this.props.iframeHeight}
          currentUser={this.props.user}
        // likeable={this.props.likeable}
        // navigateTo={this.props.navigateTo}
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
    navigateTo: PropTypes.func
  }


  render() {
    console.log("IFRAME SRC: ")
    console.log(this.props.iframeSrc)
    console.log(this.props.iframeHeight)
    return (
      <Card
        style={styles.card}
        item={this.props.item}
        navigation={this.props.navigation}
        onPress={this.props.navigateTo ? () => { this.props.navigateTo(this.props.item) } : null}
      >
        <Header
          author_avatar_url={this.props.item.author_avatar_url}
          title={this.props.item.title}
          author_gamertag={this.props.item.author_gamertag}
          display_after={this.props.item.display_after} />
        <FeedImage item={this.props.item} imageUrl={this.props.imageUrl} />
        <FeedBody item={this.props.item} iframeSrc={this.props.iframeSrc} iframeHeight={this.props.iframeHeight} />
        {this.props.item.item_type != "player-left-game" && this.props.currentUser &&
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

