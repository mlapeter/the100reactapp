import jwtDecode from "../../node_modules/jwt-decode";
import { AsyncStorage } from "react-native";
import { Font } from "expo";
import { takeEvery, takeLatest, select, call, put } from "redux-saga/effects";
import Environment from "../config/environment";

import {
  FETCH_TOKEN,
  FETCH_TOKEN_RESULT,
  FETCH_TOKEN_ERROR,
  DECODE_TOKEN,
  DECODE_TOKEN_RESULT,
  DECODE_TOKEN_ERROR,
  REMOVE_TOKEN,
  REMOVE_TOKEN_ERROR
} from "../actions/authentication";

import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_RESULT,
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_NOTIFICATIONS_NO_DATA
} from "../actions/notifications";

import {
  UPDATE_USER,
  UPDATE_USER_RESULT,
  UPDATE_USER_ERROR,
  UPDATE_USER_PUSH_TOKEN,
  FETCH_USER,
  FETCH_USER_RESULT,
  FETCH_USER_ERROR,
  FETCH_CURRENT_USER,
  FETCH_CURRENT_USER_RESULT,
  FETCH_FRIENDS,
  FETCH_FRIENDS_RESULT,
  FETCH_FRIENDS_ERROR,
  FETCH_FRIENDS_NO_DATA,
  LOAD_MORE_FRIENDS,
  LOAD_MORE_FRIENDS_RESULT,
  CHANGE_FRIENDS_PAGE,
  REFRESH_FRIENDS,
  FETCH_PENDING_FRIENDS,
  FETCH_PENDING_FRIENDS_RESULT,
  FETCH_PENDING_FRIENDS_ERROR,
  FETCH_PENDING_FRIENDS_NO_DATA,
  LOAD_MORE_PENDING_FRIENDS,
  LOAD_MORE_PENDING_FRIENDS_RESULT,
  CHANGE_PENDING_FRIENDS_PAGE,
  REFRESH_PENDING_FRIENDS,
  FETCH_GROUP_MEMBERS,
  FETCH_GROUP_MEMBERS_RESULT,
  FETCH_GROUP_MEMBERS_ERROR,
  FETCH_GROUP_MEMBERS_NO_DATA,
  LOAD_MORE_GROUP_MEMBERS,
  LOAD_MORE_GROUP_MEMBERS_RESULT,
  CHANGE_GROUP_MEMBERS_PAGE,
  REFRESH_GROUP_MEMBERS
} from "../actions/users";

import {
  FETCH_GROUP,
  FETCH_GROUP_RESULT,
  FETCH_GROUP_ERROR,
  FETCH_GROUP_EMPTY,
  CHANGE_GROUP
} from "../actions/group";

import {
  FETCH_GAMES,
  FETCH_GAMES_ERROR,
  FETCH_GAMES_RESULT,
  CHANGE_GAME,
  FETCH_ACTIVITIES_RESULT,
  CHANGE_GAMING_SESSIONS_PAGE,
  CHANGE_MY_GAMING_SESSIONS_PAGE,
  CHANGE_GROUP_GAMING_SESSIONS_PAGE,
  CHANGE_RECENT_GAMING_SESSIONS_PAGE
} from "../actions/search";

import {
  CREATE_GAMING_SESSION,
  CREATE_GAMING_SESSION_RESULT,
  CREATE_GAMING_SESSION_ERROR,
  EDIT_GAMING_SESSION,
  EDIT_GAMING_SESSION_RESULT,
  EDIT_GAMING_SESSION_ERROR,
  DELETE_GAMING_SESSION,
  DELETE_GAMING_SESSION_RESULT,
  DELETE_GAMING_SESSION_ERROR,
  FETCH_GAMING_SESSION,
  FETCH_GAMING_SESSION_RESULT,
  FETCH_GAMING_SESSION_ERROR,
  FETCH_GAMING_SESSIONS,
  FETCH_GAMING_SESSIONS_RESULT,
  FETCH_GAMING_SESSIONS_ERROR,
  FETCH_GAMING_SESSIONS_NO_DATA,
  FETCH_GAMING_SESSIONS_NO_SEARCH_RESULTS,
  REFRESH_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS,
  FETCH_MY_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS_ERROR,
  FETCH_MY_GAMING_SESSIONS_NO_DATA,
  REFRESH_MY_GAMING_SESSIONS,
  CLEAR_MY_GAMING_SESSIONS,
  LOAD_MORE_MY_GAMING_SESSIONS,
  LOAD_MORE_MY_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS,
  FETCH_GROUP_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS_ERROR,
  FETCH_GROUP_GAMING_SESSIONS_NO_DATA,
  REFRESH_GROUP_GAMING_SESSIONS,
  CLEAR_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT,
  FETCH_RECENT_GAMING_SESSIONS,
  FETCH_RECENT_GAMING_SESSIONS_RESULT,
  FETCH_RECENT_GAMING_SESSIONS_ERROR,
  FETCH_RECENT_GAMING_SESSIONS_NO_DATA,
  REFRESH_RECENT_GAMING_SESSIONS,
  CLEAR_RECENT_GAMING_SESSIONS,
  LOAD_MORE_RECENT_GAMING_SESSIONS,
  LOAD_MORE_RECENT_GAMING_SESSIONS_RESULT
} from "../actions/gamingSessions";

import { CREATE_USER, CREATE_USER_ERROR } from "../actions/onboarding";

import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_RESULT,
  FETCH_CONVERSATIONS_ERROR
} from "../actions/conversations";

const requestTimeout = (time, promise) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        reject(
          new Error("Request timed out. Try going back or restarting app.")
        ),
      time
    );
    promise.then(resolve, reject);
  });

function* fetchToken() {
  console.log("FETCHING TOKEN");
  try {
    let username = yield select(state => state.authentication.username);
    let password = yield select(state => state.authentication.password);
    const response = yield fetch(
      Environment["API_BASE_URL"] + Environment["API_VERSION"] + "sessions/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gamertag: username,
          password: password
        })
      }
    );

    const result = yield response.json();

    if (result.error) {
      yield put({ type: FETCH_TOKEN_ERROR, error: result.error });
    } else if (result.message === "Invalid credentials") {
      yield put({ type: FETCH_TOKEN_ERROR, error: result.message });
    } else {
      token = result.token;
      firebaseToken = result.firebase_token;
      AsyncStorage.setItem("id_token", token);
      AsyncStorage.setItem("fb_token", firebaseToken);

      yield put({ type: FETCH_TOKEN_RESULT, token, firebaseToken });
    }
  } catch (e) {
    yield put({ type: FETCH_TOKEN_ERROR, error: e.message });
  }
}

function* decodeToken() {
  console.log("DECODING TOKEN");
  try {
    let token = yield select(state => state.authentication.token);
    let result = jwtDecode(token);
    // let userId = yield select(state => state.authentication.user.user_id);
    yield put({ type: DECODE_TOKEN_RESULT, result });
  } catch (e) {
    yield put({ type: DECODE_TOKEN_ERROR, error: e.message });
  }
}

function* removeToken() {
  console.log("REMOVING TOKEN");
  try {
    AsyncStorage.removeItem("id_token");
    AsyncStorage.removeItem("fb_token");
    AsyncStorage.removeItem("default_group_id");
  } catch (e) {
    yield put({ type: REMOVE_TOKEN_ERROR, error: e.message });
  }
}

function* fetchData(endpoint, page, success, failure, noData) {
  try {
    let token = yield select(state => state.authentication.token);
    const response = yield requestTimeout(
      8000,
      fetch(endpoint + "&page=" + page, {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      })
    );
    const result = yield response.json();
    console.log("FETCHING ENDPOINT: ", endpoint);
    if (result.error && result.error === "Not Authorized") {
      console.log("ERROR - REMOVING TOKEN");
      AsyncStorage.removeItem("id_token");
      AsyncStorage.removeItem("fb_token");
      yield { type: failure, error: result.error };
    } else if (result.error) {
      console.log(result);
      yield { type: failure, error: result.error };
    } else if (result.length === 0) {
      console.log("no data returned");
      yield put({ type: noData, result });
    } else {
      yield put({ type: success, result });
    }
  } catch (e) {
    console.log("Error: " + e.message + " ", endpoint);
    yield put({ type: failure, error: e.message });
  }
}

function* postData(method, endpoint, body, success, failure) {
  console.log("POSTING DATA TO: ", endpoint);
  try {
    let token = yield select(state => state.authentication.token);
    console.log("BODY:");
    console.log(body);
    const response = yield fetch(endpoint, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: body
    });
    console.log("RESPONSE ---------");
    const result = yield response.json();
    console.log(result);

    if (!response.ok) {
      console.log("POST DATA ERROR ------");
      yield put({
        type: failure,
        error: result.message
      });
    } else if (result.error) {
      yield put({ type: failure, error: result.error });
    } else {
      console.log("postData Success");
      console.log(result);
      yield put({ type: success, result });
    }
  } catch (e) {
    console.log("error posting data");
    yield put({ type: failure, error: e.message });
  }
}

function* deleteGamingSession() {
  console.log("DELETING GAMING SESSION");
  try {
    let token = yield select(state => state.authentication.token);
    let deleteGamingSessionId = yield select(
      state => state.gamingSessions.deleteGamingSessionId
    );
    let body = JSON.stringify({});

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "gaming_sessions/" +
      deleteGamingSessionId;

    yield call(
      postData,
      "DELETE",
      endpoint,
      body,
      DELETE_GAMING_SESSION_RESULT,
      DELETE_GAMING_SESSION_ERROR
    );
  } catch (e) {
    yield put({
      type: DELETE_GAMING_SESSION_ERROR,
      error: "Error Deleting Gaming Session: " + e.message
    });
  }
}

function* updateUserPushToken() {
  console.log("UPDATING USER PUSH TOKEN");
  try {
    let token = yield select(state => state.authentication.token);
    let userId = yield select(state => state.authentication.user.user_id);
    let expoPushToken = yield select(state => state.users.expoPushToken);

    const response = yield fetch(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "users/" +
        userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(expoPushToken)
      }
    );
    const result = yield response.json();
    console.log(result);
  } catch (e) {
    console.log("ERROR UPDATING EXPO PUSH TOKEN");
  }
}

function* updateUser() {
  console.log("UPDATING USER");
  try {
    let token = yield select(state => state.authentication.token);
    let userId = yield select(state => state.authentication.user.user_id);
    let user = yield select(state => state.users.currentUser);

    const response = yield fetch(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "users/" +
        userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(user)

        // body: JSON.stringify({
        //   gamertag: user.gamertag,
        //   platform: user.platform,
        //   play_style: user.play_style,
        //   play_schedule: user.play_schedule,
        //   light_level: user.light_level,
        //   age: user.age,
        //   no_emails: user.no_emails,
        //   no_push_notifications: user.no_push_notifications,
        //   push_new_group_game: user.push_new_group_game,
        //   push_new_friend_game: user.push_new_friend_game,
        //   push_player_joined_left: user.push_player_joined_left,
        //   push_game_time_changed: user.push_game_time_changed,
        //   push_username_mention: user.push_username_mention,
        //   push_karma_received: user.push_karma_received,
        //   push_private_message_received: user.push_private_message_received,
        //   push_game_reminder: user.push_game_reminder
        // })
      }
    );
    const result = yield response.json();
    console.log(result);
    if (result.error) {
      yield put({ type: UPDATE_USER_ERROR, error: result.error });
    } else if (result.message === "Invalid credentials") {
      yield put({ type: UPDATE_USER_ERROR, error: result.message });
    } else {
      yield put({ type: UPDATE_USER_RESULT, result });
    }
  } catch (e) {
    yield put({ type: UPDATE_USER_ERROR, error: e.message });
  }
}

function* createGamingSession() {
  console.log("CREATING GAMING SESSION");
  try {
    let token = yield select(state => state.authentication.token);
    let gamingSession = yield select(
      state => state.gamingSessions.gamingSession
    );
    let platform = yield select(state => state.search.platform);
    // let gameId = yield select(state => state.search.gameId);

    const response = yield fetch(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "gaming_sessions/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          game_id: gamingSession.game_id,
          platform: platform,
          description: gamingSession.description,
          activity: gamingSession.activity,
          start_time: gamingSession.start_time,
          group_name: gamingSession.group,
          friends_only: gamingSession.friends_only,
          group_only: gamingSession.group_only,
          make_auto_public: gamingSession.make_auto_public,
          beginners_welcome: gamingSession.beginners_welcome,
          sherpa_requested: gamingSession.sherpa_requested,
          headset_required: gamingSession.mic_required,
          party_size: gamingSession.party_size,
          platform: gamingSession.platform
        })
      }
    );
    console.log(response);
    const result = yield response.json();
    if (result.error) {
      yield put({ type: CREATE_GAMING_SESSION_ERROR, error: result.error });
    } else if (result.message === "Invalid credentials") {
      yield put({ type: CREATE_GAMING_SESSION_ERROR, error: result.message });
    } else {
      yield put({ type: CREATE_GAMING_SESSION_RESULT, result });
    }
  } catch (e) {
    yield put({ type: CREATE_GAMING_SESSION_ERROR, error: e.message });
  }
}

function* editGamingSession() {
  try {
    let token = yield select(state => state.authentication.token);
    let gamingSession = yield select(
      state => state.gamingSessions.gamingSession
    );
    let gamingSessionId = yield select(
      state => state.gamingSessions.gamingSessionId
    );
    let platform = yield select(state => state.search.platform);
    console.log(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "gaming_sessions/" +
        gamingSessionId
    );
    const response = yield fetch(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "gaming_sessions/" +
        gamingSessionId,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          game_id: gamingSession.game_id,
          name: gamingSession.description,
          category: gamingSession.activity,
          platform: platform,
          start_time: gamingSession.start_time,
          start_date: gamingSession.start_time,
          group_name: gamingSession.group,
          friends_only: gamingSession.friends_only,
          group_only: gamingSession.group_only,
          make_auto_public: gamingSession.make_auto_public,
          beginners_welcome: gamingSession.beginners_welcome,
          sherpa_requested: gamingSession.sherpa_requested,
          mic_required: gamingSession.mic_required,
          party_size: gamingSession.party_size,
          platform: gamingSession.platform
        })
      }
    );
    const result = yield response.json();
    if (result.error) {
      yield put({ type: EDIT_GAMING_SESSION_ERROR, error: result.error });
    } else if (result.message === "Invalid credentials") {
      yield put({ type: EDIT_GAMING_SESSION_ERROR, error: result.message });
    } else {
      yield put({ type: EDIT_GAMING_SESSION_RESULT, result });
    }
  } catch (e) {
    yield put({ type: EDIT_GAMING_SESSION_ERROR, error: e.message });
  }
}

function* fetchNotifications() {
  console.log("FETCHING NOTIFICATIONS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/notifications?";
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_NOTIFICATIONS_RESULT,
      FETCH_NOTIFICATIONS_ERROR,
      FETCH_NOTIFICATIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_NOTIFICATIONS_ERROR, error: e.message });
  }
}

function* fetchGames() {
  console.log("FETCHING GAMES");
  try {
    let endpoint =
      Environment["API_BASE_URL"] + Environment["API_VERSION"] + "games?";
    yield call(fetchData, endpoint, 1, FETCH_GAMES_RESULT, FETCH_GAMES_ERROR);
  } catch (e) {
    yield put({ type: FETCH_GAMES_ERROR, error: "fetchGames: " + e.message });
  }
}

function* fetchActivities() {
  console.log("FETCHING ACTIVITIES");
  try {
    let gameId = yield select(state => state.search.gameId);
    let games = yield select(state => state.search.games);

    let game = games.find(function(game) {
      return game.id === gameId;
    });

    console.log("GAME: ", game.name);
    let activities = game.activities.sort((a, b) => a.localeCompare(b));
    yield put({ type: FETCH_ACTIVITIES_RESULT, activities });
  } catch (e) {
    yield put({
      type: FETCH_GAMES_ERROR,
      error: "fetchActivities: " + e.message
    });
  }
}

function* fetchCurrentUser() {
  console.log("FETCHING CURRENT USER");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId;
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_CURRENT_USER_RESULT,
      FETCH_USER_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_USER_ERROR, error: e.message });
  }
}

function* fetchUser() {
  console.log("FETCHING USER");
  try {
    let userId = yield select(state => state.users.userId);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId;
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_USER_RESULT,
      FETCH_USER_ERROR,
      FETCH_USER_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_USER_ERROR, error: e.message });
  }
}

function* fetchFriends() {
  console.log("FETCHING FRIENDS");
  try {
    yield put({ type: CHANGE_FRIENDS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    // let current_page = yield select(state => state.users.friendsPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/friends?";
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_FRIENDS_RESULT,
      FETCH_FRIENDS_ERROR,
      FETCH_FRIENDS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_FRIENDS_ERROR, error: e.message });
  }
}

function* loadMoreFriends() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.friendsPage);
    yield put({ type: CHANGE_FRIENDS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.friendsPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/friends?";
    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_FRIENDS_RESULT,
      FETCH_FRIENDS_ERROR,
      FETCH_FRIENDS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_FRIENDS_ERROR, error: e.message });
  }
}

function* fetchPendingFriends() {
  try {
    yield put({ type: CHANGE_PENDING_FRIENDS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.pendingFriendsPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/pending_friends?";
    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_PENDING_FRIENDS_RESULT,
      FETCH_PENDING_FRIENDS_ERROR,
      FETCH_PENDING_FRIENDS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_PENDING_FRIENDS_ERROR, error: e.message });
  }
}

function* loadMorePendingFriends() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.pendingFriendsPage);
    yield put({ type: CHANGE_PENDING_FRIENDS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.pendingFriendsPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/pending_friends?";
    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_PENDING_FRIENDS_RESULT,
      FETCH_PENDING_FRIENDS_ERROR,
      FETCH_PENDING_FRIENDS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_PENDING_FRIENDS_ERROR, error: e.message });
  }
}

function* fetchGroupMembers() {
  console.log("FETCHING GROUP MEMBERS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/group_members?";

    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_GROUP_MEMBERS_RESULT,
      FETCH_GROUP_MEMBERS_ERROR,
      FETCH_GROUP_MEMBERS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_MEMBERS_ERROR, error: e.message });
  }
}

function* loadMoreGroupMembers() {
  console.log("LOAD MORE GROUP MEMBERS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);
    yield put({ type: CHANGE_GROUP_MEMBERS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/group_members?";
    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_GROUP_MEMBERS_RESULT,
      FETCH_GROUP_MEMBERS_ERROR,
      FETCH_GROUP_MEMBERS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_MEMBERS_ERROR, error: e.message });
  }
}

function* refreshGroupMembers() {
  console.log("REFRESH GROUP MEMBERS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    yield put({ type: CHANGE_GROUP_MEMBERS_PAGE, page: 1 });
    let new_page = yield select(state => state.users.groupMembersPage);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/group_members?";
    yield call(
      fetchData,
      endpoint,
      new_page,
      FETCH_GROUP_MEMBERS_RESULT,
      FETCH_GROUP_MEMBERS_ERROR,
      FETCH_GROUP_MEMBERS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_MEMBERS_ERROR, error: e.message });
  }
}

function* fetchGroup() {
  console.log("STARTING FETCH GROUP");
  try {
    let user = yield select(state => state.users.currentUser);
    let selectedGroupId = yield select(state => state.group.selectedGroupId);
    let endpoint = "";
    if (selectedGroupId == null && user.groups && user.groups[0]) {
      endpoint =
        Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "groups/" +
        user.groups[0]["id"];
      console.log("FETCHING GROUP (no default group): ", endpoint);

      yield call(fetchData, endpoint, 1, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
    } else if (selectedGroupId == null) {
      console.log("FETCH GROUP - EMPTY");
      yield put({ type: FETCH_GROUP_EMPTY });
    } else {
      endpoint =
        Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "groups/" +
        selectedGroupId;
      console.log("FETCHING GROUP: ", endpoint);

      yield call(fetchData, endpoint, 1, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
      AsyncStorage.setItem("default_group_id", selectedGroupId.toString());
    }
  } catch (e) {
    console.log("FETCH GROUP ERROR");
    console.log(e.message);
    // console.log(user);
    yield put({ type: FETCH_GROUP_ERROR, error: e.message });
  }
}

function* fetchGamingSession() {
  try {
    let gamingSessionId = yield select(
      state => state.gamingSessions.gamingSessionId
    );

    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "gaming_sessions/" +
      gamingSessionId;
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_GAMING_SESSION_RESULT,
      FETCH_GAMING_SESSION_ERROR,
      FETCH_GAMING_SESSION_RESULT
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSION_ERROR, error: e.message });
  }
}

function* fetchGamingSessions() {
  try {
    yield put({ type: CHANGE_GAMING_SESSIONS_PAGE, page: 1 });
    let endpoint = yield select(state => state.gamingSessions.endpoint);
    let current_page = yield select(state => state.search.gamingSessionsPage);

    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_GAMING_SESSIONS_RESULT,
      FETCH_GAMING_SESSIONS_ERROR,
      FETCH_GAMING_SESSIONS_NO_SEARCH_RESULTS
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreGamingSessions() {
  console.log("LOAD MORE GAMING SESSIONS");
  try {
    let current_page = yield select(state => state.search.gamingSessionsPage);
    yield put({ type: CHANGE_GAMING_SESSIONS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.search.gamingSessionsPage);

    let endpoint = yield select(state => state.gamingSessions.endpoint);

    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_GAMING_SESSIONS_RESULT,
      FETCH_GAMING_SESSIONS_ERROR,
      FETCH_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* fetchMyGamingSessions() {
  try {
    yield put({ type: CLEAR_MY_GAMING_SESSIONS });
    yield put({ type: CHANGE_MY_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.search.myGamingSessionsPage);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/gaming_sessions?";

    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_MY_GAMING_SESSIONS_RESULT,
      FETCH_MY_GAMING_SESSIONS_ERROR,
      FETCH_MY_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_MY_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreMyGamingSessions() {
  console.log("LOAD MORE MY GAMING SESSIONS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.search.myGamingSessionsPage);
    yield put({ type: CHANGE_MY_GAMING_SESSIONS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.search.myGamingSessionsPage);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/gaming_sessions?";

    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_MY_GAMING_SESSIONS_RESULT,
      FETCH_MY_GAMING_SESSIONS_ERROR,
      FETCH_MY_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_MY_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* fetchGroupGamingSessions() {
  try {
    yield put({ type: CLEAR_GROUP_GAMING_SESSIONS });
    yield put({ type: CHANGE_GROUP_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(
      state => state.search.groupGamingSessionsPage
    );
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/group_gaming_sessions?";
    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_GROUP_GAMING_SESSIONS_RESULT,
      FETCH_GROUP_GAMING_SESSIONS_ERROR,
      FETCH_GROUP_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreGroupGamingSessions() {
  console.log("LOAD MORE GROUP GAMING SESSIONS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(
      state => state.search.groupGamingSessionsPage
    );
    yield put({
      type: CHANGE_GROUP_GAMING_SESSIONS_PAGE,
      page: current_page + 1
    });
    let new_page = yield select(state => state.search.groupGamingSessionsPage);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/group_gaming_sessions?";

    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT,
      FETCH_GROUP_GAMING_SESSIONS_ERROR,
      FETCH_GROUP_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* fetchRecentGamingSessions() {
  console.log("Fetching Recent Gaming Sessions");
  try {
    yield put({ type: CLEAR_RECENT_GAMING_SESSIONS });
    yield put({ type: CHANGE_RECENT_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(
      state => state.search.recentGamingSessionsPage
    );
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/recent_gaming_sessions?";

    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_RECENT_GAMING_SESSIONS_RESULT,
      FETCH_RECENT_GAMING_SESSIONS_ERROR,
      FETCH_RECENT_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_RECENT_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreRecentGamingSessions() {
  console.log("LOAD MORE RECENT GAMING SESSIONS");
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(
      state => state.search.recentGamingSessionsPage
    );
    yield put({
      type: CHANGE_RECENT_GAMING_SESSIONS_PAGE,
      page: current_page + 1
    });
    let new_page = yield select(state => state.search.recentGamingSessionsPage);
    let endpoint =
      Environment["API_BASE_URL"] +
      Environment["API_VERSION"] +
      "users/" +
      userId +
      "/recent_gaming_sessions?";

    yield call(
      fetchData,
      endpoint,
      new_page,
      LOAD_MORE_RECENT_GAMING_SESSIONS_RESULT,
      FETCH_RECENT_GAMING_SESSIONS_ERROR,
      FETCH_RECENT_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_RECENT_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* createUser() {
  try {
    let userInfo = yield select(state => state.onboarding);
    console.log("USER INFO: ");
    console.log(userInfo);
    const response = yield fetch(
      Environment["API_BASE_URL"] + Environment["API_VERSION"] + "users/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: {
            ...userInfo
          }
        })
      }
    );
    const result = yield response.json();
    if (result.error) {
      yield put({ type: CREATE_USER_ERROR, error: result.error });
    } else {
      console.log("New User Created: ");
      console.log(result);
      token = result.token;
      firebaseToken = result.firebase_token;
      AsyncStorage.setItem("id_token", token);
      AsyncStorage.setItem("fb_token", firebaseToken);
      yield put({ type: FETCH_TOKEN_RESULT, token, firebaseToken });
    }
  } catch (e) {
    yield put({ type: FETCH_TOKEN_ERROR, error: e.message });
  }
}

function* fetchConversations() {
  console.log("FETCH CONVERSATIONS");
  try {
    let token = yield select(state => state.authentication.token);

    let response = yield fetch(
      Environment["API_BASE_URL"] +
        Environment["API_VERSION"] +
        "conversations/",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      }
    );

    let result = yield response.json();

    if (result.error) {
      yield put({ type: FETCH_CONVERSATIONS_ERROR, error: result.error });
    } else {
      yield put({ type: FETCH_CONVERSATIONS_RESULT, conversations: result });
    }
  } catch (e) {
    yield put({ type: FETCH_CONVERSATIONS_ERROR, error: e.message });
  }
}

export default function* rootSaga() {
  yield takeEvery(CREATE_USER, createUser);

  yield takeEvery(FETCH_TOKEN, fetchToken);
  yield takeEvery(FETCH_TOKEN_RESULT, decodeToken);
  yield takeEvery(DECODE_TOKEN, decodeToken);

  yield takeEvery(DECODE_TOKEN_RESULT, fetchCurrentUser);
  // yield takeEvery(DECODE_TOKEN_RESULT, fetchGames);

  // called from authloading.js because we need default group from AsyncStorage
  // yield takeEvery(FETCH_CURRENT_USER_RESULT, fetchGroup);

  yield takeEvery(REMOVE_TOKEN, removeToken);

  yield takeEvery(UPDATE_USER, updateUser);
  yield takeEvery(UPDATE_USER_RESULT, fetchCurrentUser);

  yield takeEvery(UPDATE_USER_PUSH_TOKEN, updateUserPushToken);

  yield takeEvery(FETCH_CURRENT_USER, fetchCurrentUser);

  yield takeEvery(FETCH_USER, fetchUser);

  yield takeEvery(FETCH_FRIENDS, fetchFriends);
  yield takeEvery(LOAD_MORE_FRIENDS, loadMoreFriends);
  yield takeEvery(REFRESH_FRIENDS, fetchFriends);

  yield takeEvery(FETCH_GROUP_MEMBERS, fetchGroupMembers);
  yield takeEvery(LOAD_MORE_GROUP_MEMBERS, loadMoreGroupMembers);
  yield takeEvery(REFRESH_GROUP_MEMBERS, refreshGroupMembers);

  yield takeEvery(FETCH_PENDING_FRIENDS, fetchPendingFriends);
  yield takeEvery(LOAD_MORE_PENDING_FRIENDS, loadMorePendingFriends);
  yield takeEvery(REFRESH_PENDING_FRIENDS, fetchPendingFriends);

  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);

  yield takeEvery(CHANGE_GROUP, fetchGroup);
  yield takeEvery(FETCH_GROUP, fetchGroup);

  yield takeEvery(CREATE_GAMING_SESSION, createGamingSession);
  yield takeEvery(EDIT_GAMING_SESSION, editGamingSession);
  yield takeEvery(DELETE_GAMING_SESSION, deleteGamingSession);

  yield takeEvery(FETCH_GAMES, fetchGames);
  yield takeEvery(FETCH_GAMES_RESULT, fetchActivities);
  yield takeEvery(CHANGE_GAME, fetchActivities);

  yield takeEvery(FETCH_GAMING_SESSION, fetchGamingSession);

  yield takeEvery(FETCH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(REFRESH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(LOAD_MORE_GAMING_SESSIONS, loadMoreGamingSessions);
  yield takeEvery(FETCH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(REFRESH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(LOAD_MORE_MY_GAMING_SESSIONS, loadMoreMyGamingSessions);
  yield takeEvery(FETCH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(REFRESH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(LOAD_MORE_GROUP_GAMING_SESSIONS, loadMoreGroupGamingSessions);
  yield takeEvery(FETCH_RECENT_GAMING_SESSIONS, fetchRecentGamingSessions);
  yield takeEvery(REFRESH_RECENT_GAMING_SESSIONS, fetchRecentGamingSessions);
  yield takeEvery(
    LOAD_MORE_RECENT_GAMING_SESSIONS,
    loadMoreRecentGamingSessions
  );

  yield takeEvery(FETCH_CONVERSATIONS, fetchConversations);
}
