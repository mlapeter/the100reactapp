import { takeEvery, select, call, put } from "redux-saga/effects";
import {
  FETCH_NOTIFICATIONS,
  FETCH_RESULT,
  FETCH_ERROR
} from "../actions/notifications";

const fetchNotification = token =>
  fetch("http://pwn-staging.herokuapp.com/api/v2/users/11869/notifications", {
    method: "GET",
    headers: { Authorization: "Bearer " + token }
  });

function* fetchAllNotifications(action) {
  try {
    let token = action.token;
    if (token === undefined) {
      token = yield select(state => state.authentication.token);
    }
    const response = yield call(fetchNotification, token);
    const result = yield response.json();

    if (result.error) {
      yield put({ type: FETCH_ERROR, error: result.error });
    } else {
      yield put({ type: FETCH_RESULT, result });
    }
  } catch (e) {
    yield put({ type: FETCH_ERROR, error: e.message });
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_NOTIFICATIONS, fetchAllNotifications);
}
