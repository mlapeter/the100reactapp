import jwtDecode from "../../node_modules/jwt-decode";
import { AsyncStorage } from "react-native";
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
  FETCH_FRIENDS_ERROR
} from "../actions/friends";

import {
  FETCH_GROUP,
  FETCH_GROUP_RESULT,
  FETCH_GROUP_ERROR
} from "../actions/group";

import { CHANGE_PAGE } from "../actions/search";

import {
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
      "http://pwn-staging.herokuapp.com/api/v2/sessions/",
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
    } else {
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

function* fetchData(endpoint, success, failure, noData) {
  try {
    let token = yield select(state => state.authentication.token);
    const response = yield fetch(endpoint, {
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

function* fetchNotifications() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      "http://pwn-staging.herokuapp.com/api/v2/users/" +
      userId +
      "/notifications";
    yield call(
      fetchData,
      endpoint,
      FETCH_NOTIFICATIONS_RESULT,
      FETCH_NOTIFICATIONS_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_NOTIFICATIONS_ERROR, error: e.message });
  }
}

function* fetchFriends() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      "http://pwn-staging.herokuapp.com/api/v2/users/" + userId + "/friends";
    yield call(fetchData, endpoint, FETCH_FRIENDS_RESULT, FETCH_FRIENDS_ERROR);
  } catch (e) {
    yield put({ type: FETCH_FRIENDS_ERROR, error: e.message });
  }
}

function* fetchGroup() {
  try {
    let endpoint = "https://pwn-staging.herokuapp.com/api/v2/groups/47";
    yield call(fetchData, endpoint, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
  } catch (e) {
    yield put({ type: FETCH_GROUP_ERROR, error: e.message });
  }
}

function* fetchGamingSessions() {
  try {
    let endpoint = yield select(state => state.gamingSessions.endpoint);
    yield call(
      fetchData,
      endpoint,
      FETCH_GAMING_SESSIONS_RESULT,
      FETCH_GAMING_SESSIONS_ERROR,
      FETCH_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreGamingSessions() {
  try {
    let current_page = yield select(state => state.search.page);
    yield put({ type: CHANGE_PAGE, page: current_page + 1 });

    let endpoint = yield select(state => state.gamingSessions.endpoint);
    yield call(
      fetchData,
      endpoint,
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
    let userId = yield select(state => state.authentication.user.user_id);
    console.log("USER ID: ", userId);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/users/" +
      userId +
      "/gaming_sessions";
    yield call(
      fetchData,
      endpoint,
      FETCH_MY_GAMING_SESSIONS_RESULT,
      FETCH_MY_GAMING_SESSIONS_ERROR,
      FETCH_MY_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_MY_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* fetchGroupGamingSessions() {
  try {
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/groups/47/gaming_sessions";
    yield call(
      fetchData,
      endpoint,
      FETCH_GROUP_GAMING_SESSIONS_RESULT,
      FETCH_GROUP_GAMING_SESSIONS_ERROR,
      FETCH_GROUP_GAMING_SESSIONS_NO_DATA
    );
  } catch (e) {
    yield put({ type: FETCH_MY_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

function* loadMoreGroupGamingSessions() {
  try {
    let current_page = yield select(state => state.search.page);
    yield put({ type: CHANGE_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.search.page);
    let endpoint =
      "https://pwn-staging.herokuapp.com/api/v2/groups/47/gaming_sessions?page=" +
      (new_page + 1);
    yield call(
      fetchData,
      endpoint,
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
  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);
  yield takeEvery(FETCH_GROUP, fetchGroup);
  yield takeEvery(FETCH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(REFRESH_GAMING_SESSIONS, fetchGamingSessions);
  yield takeEvery(LOAD_MORE_GAMING_SESSIONS, loadMoreGamingSessions);
  yield takeEvery(FETCH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(REFRESH_MY_GAMING_SESSIONS, fetchMyGamingSessions);
  yield takeEvery(FETCH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(REFRESH_GROUP_GAMING_SESSIONS, fetchGroupGamingSessions);
  yield takeEvery(LOAD_MORE_GROUP_GAMING_SESSIONS, loadMoreGroupGamingSessions);
}
