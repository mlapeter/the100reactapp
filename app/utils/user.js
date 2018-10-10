import firebase from "./firebase";

export async function firebaseSignOut() {
  firebase.auth().signOut();
}

export async function firebaseSignIn(token, allowAnon = false, authedUser) {
  console.log("firebaseSignIn authedUser groups: ", authedUser.groups);
  let uid = null;
  let anon = false;

  let currentUser = firebase.auth().currentUser;
  // Causes error first time user tries to login to app
  // if (currentUser && (!currentUser.isAnonymous || (allowAnon && !token))) {

  if (currentUser) {
    uid = currentUser.uid;
    anon = currentUser.isAnonymous;
  } else if (token) {
    let authUser = await firebase.auth().signInWithCustomToken(token);
    uid = authUser.uid;
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
  } else if (allowAnon) {
    let authUser = await firebase.auth().signInAnonymously();
    uid = authUser.uid;
    anon = true;
  } else {
    throw new Error("Tried to sign-in without Token.");
  }

  if (anon) {
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
    let userData = (await firebase
      .database()
      .ref("/users/" + uid)
      .once("value")).val();
    userData.uid = uid;
    userData.anon = false;
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
