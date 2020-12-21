import AsyncStorage from '@react-native-async-storage/async-storage';
import Environment from "../config/environment";

export function postLike(feedItemId) {
  AsyncStorage.getItem("id_token").then(token => {
    fetch(Environment["API_BASE_URL"] + Environment["API_VERSION"] + "likes/", {
      method: "POST",
      body: JSON.stringify({ like: { feed_item_id: feedItemId } }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("ITEM LIKED");
      })
      .catch(error => {
        console.log(error);
      });
  });
}
