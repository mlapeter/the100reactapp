var environments = {
  staging: {
    API_BASE_URL: "https://pwn-staging.herokuapp.com/api/",
    API_VERSION: "v2/",
    DEFAULT_GAME_ID: 13,
    FIREBASE_API_KEY: "AIzaSyDTZp0K0KXe7Xt-vGNeYEBDBq-PeJyUTKw",
    FIREBASE_AUTH_DOMAIN: "the100-staging-42536.firebaseapp.com",
    FIREBASE_DATABASE_URL: "https://the100-staging-42536.firebaseio.com/",
    FIREBASE_PROJECT_ID: "the100-staging-42536",
    FIREBASE_STORAGE_BUCKET: "the100-staging-42536.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "",
    GOOGLE_ANALYTICS_ID: "UA-55503040-1"
  }
};

function getReleaseChannel() {
  let releaseChannel = Expo.Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return "staging";
  } else if (releaseChannel === "staging") {
    return "staging";
  } else {
    return "staging";
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
