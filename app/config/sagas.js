import { takeEvery, takeLatest, select, call, put } from "redux-saga/effects";
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

import {
  FETCH_GAMING_SESSIONS,
  FETCH_GAMING_SESSIONS_RESULT,
  FETCH_GAMING_SESSIONS_ERROR
} from "../actions/gamingSessions";

function* fetchData(endpoint, success, failure) {
  try {
    let token = yield select(state => state.authentication.token);
    const response = yield fetch(endpoint, {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });
    const result = yield response.json();
    if (result.error) {
      yield put({ type: failure, error: result.error });
    } else {
      yield put({ type: success, result });
    }
  } catch (e) {
    yield put({ type: failure, error: e.message });
  }
}

function* fetchNotifications() {
  try {
    let userId = yield select(state => state.authentication.userId);
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
    let userId = yield select(state => state.authentication.userId);
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
      FETCH_GAMING_SESSIONS_ERROR
    );
  } catch (e) {
    yield put({ type: FETCH_GAMING_SESSIONS_ERROR, error: e.message });
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_FRIENDS, fetchFriends);
  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);
  yield takeEvery(FETCH_GROUP, fetchGroup);
  yield takeEvery(FETCH_GAMING_SESSIONS, fetchGamingSessions);
}
