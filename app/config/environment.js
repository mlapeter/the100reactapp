var environments = {
  staging: {
    API_BASE_URL: "https://pwn-staging.herokuapp.com/api/",
    API_VERSION: "v2/",
    DEFAULT_GAME_ID: 13,
    FIREBASE_API_KEY: "",
    FIREBASE_AUTH_DOMAIN: "",
    FIREBASE_DATABASE_URL: "",
    FIREBASE_PROJECT_ID: "",
    FIREBASE_STORAGE_BUCKET: "",
    FIREBASE_MESSAGING_SENDER_ID: "",
    GOOGLE_ANALYTICS_ID: ""
  },
};

function getReleaseChannel() {
  let releaseChannel = Expo.Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return "staging";
  } else if (releaseChannel === "staging") {
    return "staging";
  } else {
    return "production";
  }
}

function getEnvironment(env) {
  console.log("Release Channel: ", getReleaseChannel());
  return environments[env];
}

var Environment = getEnvironment(getReleaseChannel());

// function getEnvironment(env) {
//   return environments[env];
// }

// var Environment = getEnvironment("production");

export default Environment;
