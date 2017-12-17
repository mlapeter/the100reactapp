import firebase from "./firebase";

export function firebaseSignIn(token, allowAnon = false) {
  if (token) {
    return firebase
      .auth()
      .signInWithCustomToken(token)
      .then(({ uid }) => {
        return firebase
          .database()
          .ref("/users/" + uid)
          .once("value")
          .then(snapshot => {
            let user = snapshot.val();
            user.uid = uid;
            user.anon = false;
            return user;
          });
      });
  } else if (allowAnon) {
    return firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        return {
          uid: user.uid,
          avatar: "/default-avatar.png",
          groups: {},
          pwnmaster: false,
          supporter: false,
          username: "guest",
          anon: true
        };
      });
  } else {
    return Promise.reject(new Error("Tried to sign-in without Token."));
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
