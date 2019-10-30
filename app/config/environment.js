var environments = {
  production: {
    API_BASE_URL: "https://pwntastic.herokuapp.com/api/",
    API_VERSION: "v2/",
    DEFAULT_GAME_ID: 23,
    FIREBASE_API_KEY: "AIzaSyDVZr1PfafkchNs7uGV4KXDsVhtz-NBhWA",
    FIREBASE_AUTH_DOMAIN: "the100-chat.firebaseapp.com",
    FIREBASE_DATABASE_URL: "https://the100-chat.firebaseio.com/",
    FIREBASE_PROJECT_ID: "the100-chat",
    FIREBASE_STORAGE_BUCKET: "the100-chat.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "254217080427",
    GOOGLE_ANALYTICS_ID: "UA-55503040-1"
  },
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
    GOOGLE_ANALYTICS_ID: ""
  },
  development: {
    API_BASE_URL: "http://add-local-ip-here:3000/api/",
    API_VERSION: "v2/",
    DEFAULT_GAME_ID: 13,
    FIREBASE_API_KEY: "AIzaSyDTZp0K0KXe7Xt-vGNeYEBDBq-PeJyUTKw",
    FIREBASE_AUTH_DOMAIN: "the100-staging-42536.firebaseapp.com",
    FIREBASE_DATABASE_URL: "https://the100-staging-42536.firebaseio.com/",
    FIREBASE_PROJECT_ID: "the100-staging-42536",
    FIREBASE_STORAGE_BUCKET: "the100-staging-42536.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "",
    GOOGLE_ANALYTICS_ID: ""
  }
};

function getReleaseChannel() {
  let releaseChannel = Expo.Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return "development";
  } else if (releaseChannel === "staging") {
    return "production";
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
