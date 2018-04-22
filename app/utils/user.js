import firebase from "./firebase";

export async function firebaseSignIn(token, allowAnon = false) {
  let uid = null;
  let anon = false;

  let currentUser = firebase.auth().currentUser;
  console.log("currentUser1");
  // Causes error first time user tries to login to app
  if (currentUser && (!currentUser.isAnonymous || (allowAnon && !token))) {
    uid = currentUser.uid;
    anon = currentUser.isAnonymous;
    console.log("currentUser");
  } else if (token) {
    // if (token) {
    let authUser = await firebase.auth().signInWithCustomToken(token);
    uid = authUser.uid;
    anon = false;
    console.log("authuser");
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
      .ref(`/users/${uid}`)
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
  console.log("Room: ", room);
  if (room) {
    return room.permission;
  } else if (user.anon) {
    return anonPermission;
  } else {
    return "";
  }
}
