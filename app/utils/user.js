import firebase from "./firebase";

export async function firebaseSignOut() {
  firebase.auth().signOut();
}

export async function firebaseSignIn(token, allowAnon = false, authedUser) {
  console.log("app authedUser: ", authedUser);
  console.log(authedUser);
  let fbUser = await firebase.auth().signInWithCustomToken(token);
  uid = fbUser.uid;

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

  let userData = (await firebase
    .database()
    .ref("/users/" + uid)
    .once("value")).val();
  userData.uid = uid;
  return userData;
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
