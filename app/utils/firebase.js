import * as firebase from "firebase";

// PRODUCTION
firebase.initializeApp({
  apiKey: "AIzaSyDVZr1PfafkchNs7uGV4KXDsVhtz-NBhWA",
  authDomain: "the100-chat.firebaseapp.com",
  databaseURL: "https://the100-chat.firebaseio.com/",
  projectId: "the100-chat",
  storageBucket: "the100-chat.appspot.com",
  messagingSenderId: "254217080427"
});

// STAGING
// firebase.initializeApp({
//   apiKey: "AIzaSyDTZp0K0KXe7Xt-vGNeYEBDBq-PeJyUTKw",
//   authDomain: "the100-staging-42536.firebaseapp.com",
//   databaseURL: "https://the100-staging-42536.firebaseio.com/",
//   storageBucket: "the100-staging-42536.appspot.com"
// });

export default firebase;
