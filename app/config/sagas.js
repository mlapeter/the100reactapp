import jwtDecode from "../../node_modules/jwt-decode";
import { AsyncStorage } from "react-native";
import { Font } from "expo";
import { takeEvery, takeLatest, select, call, put } from "redux-saga/effects";
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
  FETCH_NOTIFICATIONS_ERROR
} from "../actions/notifications";

import {
  FETCH_FRIENDS,
  FETCH_FRIENDS_RESULT,
  FETCH_FRIENDS_ERROR,
  FETCH_FRIENDS_NO_DATA,
  LOAD_MORE_FRIENDS,
  LOAD_MORE_FRIENDS_RESULT,
  CHANGE_FRIENDS_PAGE,
  REFRESH_FRIENDS,
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
  FETCH_GROUP_ERROR
} from "../actions/group";

import {
  FETCH_GAMES,
  FETCH_GAMES_ERROR,
  FETCH_GAMES_RESULT,
  CHANGE_GAME,
  FETCH_ACTIVITIES_RESULT,
  CHANGE_GAMING_SESSIONS_PAGE,
  CHANGE_MY_GAMING_SESSIONS_PAGE,
  CHANGE_GROUP_GAMING_SESSIONS_PAGE
} from "../actions/search";

import {
  CREATE_GAMING_SESSION,
  CREATE_GAMING_SESSION_RESULT,
  CREATE_GAMING_SESSION_ERROR,
  FETCH_GAMING_SESSIONS,
  FETCH_GAMING_SESSIONS_RESULT,
  FETCH_GAMING_SESSIONS_ERROR,
  FETCH_GAMING_SESSIONS_NO_DATA,
  REFRESH_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS,
  LOAD_MORE_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS,
  FETCH_MY_GAMING_SESSIONS_RESULT,
  FETCH_MY_GAMING_SESSIONS_ERROR,
  FETCH_MY_GAMING_SESSIONS_NO_DATA,
  REFRESH_MY_GAMING_SESSIONS,
  LOAD_MORE_MY_GAMING_SESSIONS,
  LOAD_MORE_MY_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS,
  FETCH_GROUP_GAMING_SESSIONS_RESULT,
  FETCH_GROUP_GAMING_SESSIONS_ERROR,
  FETCH_GROUP_GAMING_SESSIONS_NO_DATA,
  REFRESH_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS,
  LOAD_MORE_GROUP_GAMING_SESSIONS_RESULT
} from "../actions/gamingSessions";

function* fetchToken() {
  try {
    let username = yield select(state => state.authentication.username);
    let password = yield select(state => state.authentication.password);

    const response = yield fetch(
      "https://pwn-staging.herokuapp.com/api/v2/sessions/",
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
      console.log("RESULT:", result);

      token = result.token;
      AsyncStorage.setItem("id_token", token);
      yield put({ type: FETCH_TOKEN_RESULT, token });
    }
  } catch (e) {
    yield put({ type: FETCH_TOKEN_ERROR, error: e.message });
  }
}

function* decodeToken() {
  try {
    let token = yield select(state => state.authentication.token);
    let result = jwtDecode(token);

    yield put({ type: DECODE_TOKEN_RESULT, result });
  } catch (e) {
    yield put({ type: DECODE_TOKEN_ERROR, error: e.message });
  }
}

function* removeToken() {
  try {
    AsyncStorage.removeItem("id_token");
  } catch (e) {
    yield put({ type: REMOVE_TOKEN_ERROR, error: e.message });
  }
}

function* fetchData(endpoint, page, success, failure, noData) {
  try {
    let token = yield select(state => state.authentication.token);
    const response = yield fetch(endpoint + "&page=" + page, {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });
    const result = yield response.json();
    if (result.error) {
      yield put({ type: failure, error: result.error });
    } else if (result.length === 0) {
      yield put({ type: noData, result });
    } else {
      yield put({ type: success, result });
    }
  } catch (e) {
    yield put({ type: failure, error: e.message });
  }
}

function* createGamingSession() {
  try {
    let token = yield select(state => state.authentication.token);
    let gamingSession = yield select(
      state => state.gamingSessions.gamingSession
    );
    let platform = yield select(state => state.search.platform);

    console.log("gamingSession is: ", gamingSession);
    const response = yield fetch(
      "https://pwn-staging.herokuapp.com/api/v2/gaming_sessions/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          name: gamingSession.description,
          category: gamingSession.activity,
          platform: platform,
          start_time: gamingSession.start_time
        })
      }
    );
    const result = yield response.json();
    console.log("RESULT----", result);
    if (result.error) {
      yield put({ type: CREATE_GAMING_SESSION_ERROR, error: result.error });
    } else if (result.message === "Invalid credentials") {
      yield put({ type: CREATE_GAMING_SESSION_ERROR, error: result.message });
    } else {
      console.log("RESULT:", result);

      yield put({ type: CREATE_GAMING_SESSION_RESULT, result });
    }
  } catch (e) {
    yield put({ type: CREATE_GAMING_SESSION_ERROR, error: e.message });
  }
}

function* fetchNotifications() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
      userId +
      "/notifications?";
    yield call(
      fetchData,
      endpoint,
      1,
      FETCH_NOTIFICATIONS_RESULT,
      FETCH_NOTIFICATIONS_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_NOTIFICATIONS_ERROR, error: e.message });
  }
}

function* fetchGames() {
  try {
    let endpoint = "https://pwn-staging.herokuapp.com/api/v1/games?";
    yield call(fetchData, endpoint, 1, FETCH_GAMES_RESULT, FETCH_GAMES_ERROR);
    yield call(fetchActivities);
  } catch (e) {
    yield put({ type: FETCH_GAMES_ERROR, error: e.message });
  }
}

function* fetchActivities() {
  try {
    let gameId = yield select(state => state.search.gameId);

    let games = yield select(state => state.search.games);
    let game = games.filter(function(obj) {
      return obj.id == gameId;
    })[0];
    yield put({ type: FETCH_ACTIVITIES_RESULT, game });

    console.log("---------GAME!! -------", game);
  } catch (e) {
    yield put({ type: FETCH_GAMES_ERROR, error: e.message });
  }
}

function* fetchFriends() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.friendsPage);

    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" + userId + "/friends?";
    yield call(
      fetchData,
      endpoint,
      current_page,
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
      "https://pwn-staging.herokuapp.com/api/v2/users/" + userId + "/friends?";
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

function* refreshFriends() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    yield put({ type: CHANGE_FRIENDS_PAGE, page: 1 });
    let new_page = yield select(state => state.users.friendsPage);

    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" + userId + "/friends?";
    yield call(
      fetchData,
      endpoint,
      new_page,
      FETCH_FRIENDS_RESULT,
      FETCH_FRIENDS_ERROR,
      FETCH_FRIENDS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_FRIENDS_ERROR, error: e.message });
  }
}

function* fetchGroupMembers() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
      userId +
      "/group_members?";

    yield call(
      fetchData,
      endpoint,
      current_page,
      FETCH_GROUP_MEMBERS_RESULT,
      FETCH_GROUP_MEMBERS_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_GROUP_MEMBERS_ERROR, error: e.message });
  }
}

function* loadMoreGroupMembers() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);
    yield put({ type: CHANGE_GROUP_MEMBERS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    yield put({ type: CHANGE_GROUP_MEMBERS_PAGE, page: 1 });
    let new_page = yield select(state => state.users.groupMembersPage);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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
  try {
    let endpoint = "https://pwn-staging.herokuapp.com/api/v2/groups/1578";
    yield call(fetchData, endpoint, 1, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
  } catch (e) {
    yield put({ type: FETCH_GROUP_ERROR, error: e.message });
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
      FETCH_GAMING_SESSIONS_RESULT
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreGamingSessions() {
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
    yield put({ type: CHANGE_MY_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.search.myGamingSessionsPage);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.search.myGamingSessionsPage);
    yield put({ type: CHANGE_MY_GAMING_SESSIONS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.search.myGamingSessionsPage);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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
    yield put({ type: FETCH_GROUP_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* fetchGroupGamingSessions() {
  try {
    yield put({ type: CHANGE_GROUP_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(
      state => state.search.groupGamingSessionsPage
    );
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
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

export default function* rootSaga() {
  yield takeEvery(FETCH_TOKEN, fetchToken);
  yield takeEvery(FETCH_TOKEN_RESULT, decodeToken);
  yield takeEvery(DECODE_TOKEN, decodeToken);

  yield takeEvery(FETCH_FRIENDS, fetchFriends);
  yield takeEvery(LOAD_MORE_FRIENDS, loadMoreFriends);
  yield takeEvery(REFRESH_FRIENDS, refreshFriends);

  yield takeEvery(FETCH_GROUP_MEMBERS, fetchGroupMembers);
  yield takeEvery(LOAD_MORE_GROUP_MEMBERS, loadMoreGroupMembers);
  yield takeEvery(REFRESH_GROUP_MEMBERS, refreshGroupMembers);

  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);
  yield takeEvery(FETCH_GROUP, fetchGroup);

  yield takeEvery(CREATE_GAMING_SESSION, createGamingSession);

  yield takeEvery(FETCH_GAMES, fetchGames);
  yield takeEvery(CHANGE_GAME, fetchActivities);

  yield takeEvery(FETCH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(REFRESH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(LOAD_MORE_GAMING_SESSIONS, loadMoreGamingSessions);
  yield takeEvery(FETCH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(REFRESH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(LOAD_MORE_MY_GAMING_SESSIONS, loadMoreMyGamingSessions);
  yield takeEvery(FETCH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(REFRESH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(LOAD_MORE_GROUP_GAMING_SESSIONS, loadMoreGroupGamingSessions);
}
