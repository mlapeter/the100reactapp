import firebase from "./firebase";

export async function firebaseSignOut() {
  firebase.auth().signOut();
}

export async function firebaseSignIn(token, allowAnon = false, authedUser) {
  // Check for already signed in user
  let currentUser = await firebase.auth().currentUser;
  if (currentUser) {
    uid = currentUser.uid;
    anon = currentUser.isAnonymous;
    // Otherwise sign into firebase
  } else if (token) {
    let fbUser = await firebase.auth().signInWithCustomToken(token);
    uid = fbUser.uid;
    anon = false;
    authedUserData = {
      username: authedUser.username,
      supporter: authedUser.supporter,
      pwnmaster: authedUser.pwnmaster,
      avatar: authedUser.computed_avatar_api,
      groups: authedUser.rooms
    };
    console.log("authedUserData: ");
    console.log(authedUserData);
    await firebase
      .database()
      .ref("users/" + uid)
      .set(authedUserData);
    // Sign in anonymously to firebase
  } else if (allowAnon) {
    let authUser = await firebase.auth().signInAnonymously();
    uid = authUser.uid;
    anon = true;
  } else {
    throw new Error("Tried to sign-in without Token.");
  }

  if (anon) {
    // Return anon user if chat allows anonymous users
    return {
      uid: uid,
      avatar: "/default-avatar.png",
      groups: {},
      pwnmaster: false,
      supporter: false,
      username: "guest",
      anon: true
    };
  } else {
    // Or return user data to use for chat
    let userData = (await firebase
      .database()
      .ref("/users/" + uid)
      .once("value")).val();
    userData.uid = uid;
    return userData;
  }
}

export function getUserChatRole(user, roomName, anonRole = "user") {
  if (user.pwnmaster) {
    return "developer";
  }
  let room = user.groups[roomName];
  if (room) {
    return room.role;
  } else if (user.anon) {
    return anonRole;
  } else {
    return "user";
  }
}

export function getUserChatPermission(user, roomName, anonPermission = "") {
  if (user.pwnmaster) {
    return "RWE";
  }
  let room = user.groups[roomName];
  if (room) {
    return room.permission;
  } else if (user.anon) {
    return anonPermission;
  } else {
    return "";
  }
}
