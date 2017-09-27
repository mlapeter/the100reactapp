import { takeEvery, select, call, put } from "redux-saga/effects";
import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_RESULT,
  FETCH_NOTIFICATIONS_ERROR
} from "../actions/notifications";

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
    let userId = yield select(state => state.notifications.endpoint);
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

export default function* rootSaga() {
  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);
}
