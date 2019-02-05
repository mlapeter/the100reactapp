import destinyActivities from "./destinyActivities.json";

export function fetchBungieImage(name) {
  let formattedName = name;
  let imageUrl = null;
  if (!name) {
    imageUrl =
      "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/placeholder.jpg";
  } else if (name.includes("Spire of Stars")) {
    formattedName = "Leviathan, Spire of Stars: Normal";
  } else if (name.includes("Last Wish")) {
    formattedName = "Last Wish: Normal";
  } else if (name.includes("Eater of Worlds")) {
    formattedName = "Leviathan, Eater of Worlds";
  } else if (name.includes("Leviathan")) {
    formattedName = "Leviathan";
  } else if (name.includes("Shattered Throne")) {
    formattedName = "The Shattered Throne";
  } else if (name.includes("Whisper of the Worm")) {
    imageUrl = "https://www.bungie.net/img/destiny_content/pgcr/patrol_io.jpg";
  } else {
    imageUrl =
      "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/placeholder.jpg";
  }
  if (imageUrl) {
    return imageUrl;
  } else {
    var result = destinyActivities.find(obj => {
      return obj.name === formattedName;
    });
    return "https://www.bungie.net" + result.pgcrImage;
  }
}
