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
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_NOTIFICATIONS_NO_DATA
} from "../actions/notifications";

import {
  UPDATE_USER,
  UPDATE_USER_RESULT,
  UPDATE_USER_ERROR,
  FETCH_USER,
  FETCH_USER_RESULT,
  FETCH_USER_ERROR,
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
  CHANGE_GROUP_GAMING_SESSIONS_PAGE
} from "../actions/search";

import {
  CREATE_GAMING_SESSION,
  CREATE_GAMING_SESSION_RESULT,
  CREATE_GAMING_SESSION_ERROR,
  EDIT_GAMING_SESSION,
  EDIT_GAMING_SESSION_RESULT,
  EDIT_GAMING_SESSION_ERROR,
  FETCH_GAMING_SESSION,
  FETCH_GAMING_SESSION_RESULT,
  FETCH_GAMING_SESSION_ERROR,
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
  CLEAR_MY_GAMING_SESSIONS,
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

import { SET_CREDENTIAL } from "../actions/onboarding";

import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_RESULT,
  FETCH_CONVERSATIONS_ERROR
} from "../actions/conversations";

function* fetchToken() {
  console.log("FETCHING TOKEN ------");
  try {
    let username = yield select(state => state.authentication.username);
    let password = yield select(state => state.authentication.password);
    const response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/sessions/",
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
      console.log("storing fb_token in saga: ", firebaseToken);
      AsyncStorage.setItem("fb_token", firebaseToken);

      yield put({ type: FETCH_TOKEN_RESULT, token, firebaseToken });
    }
  } catch (e) {
    yield put({ type: FETCH_TOKEN_ERROR, error: e.message });
  }
}

function* decodeToken() {
  console.log("DECODE TOKEN");
  try {
    let token = yield select(state => state.authentication.token);
    let result = jwtDecode(token);
    let userId = yield select(state => state.authentication.user.user_id);
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
    console.log("FETCHING DATA -----");
    // console.log(result);
    if (result.error) {
      console.log(result);
      // console.log("REMOVING TOKEN");
      // try {
      //   AsyncStorage.removeItem("id_token");
      //   AsyncStorage.removeItem("fb_token");
      // } catch (e) {
      //   yield put({ type: REMOVE_TOKEN_ERROR, error: e.message });
      // }
      yield { type: failure, error: result.error };
    } else if (result.length === 0) {
      console.log("no data returned");
      yield put({ type: noData, result });
    } else {
      yield put({ type: success, result });
    }
  } catch (e) {
    console.log("error fetching data");
    yield put({ type: failure, error: e.message });
  }
}

function* updateUser() {
  try {
    let token = yield select(state => state.authentication.token);
    let userId = yield select(state => state.authentication.user.user_id);
    let user = yield select(state => state.users.user);

    const response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/users/" + userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          gamertag: user.gamertag,
          platform: user.platform,
          play_style: user.play_style,
          play_schedule: user.play_schedule,
          light_level: user.light_level,
          age: user.age,
          no_emails: user.no_emails,
          no_push_notifications: user.no_push_notifications,
          push_new_group_game: user.push_new_group_game,
          push_new_friend_game: user.push_new_friend_game,
          push_player_joined_left: user.push_player_joined_left,
          push_game_time_changed: user.push_game_time_changed,
          push_username_mention: user.push_username_mention,
          push_karma_received: user.push_karma_received,
          push_private_message_received: user.push_private_message_received,
          push_game_reminder: user.push_game_reminder
        })
      }
    );
    const result = yield response.json();
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
  try {
    let token = yield select(state => state.authentication.token);
    let gamingSession = yield select(
      state => state.gamingSessions.gamingSession
    );
    let platform = yield select(state => state.search.platform);

    const response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/gaming_sessions/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          description: gamingSession.description,
          activity: gamingSession.activity,
          platform: platform,
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
      "https://pwntastic.herokuapp.com/api/v2/gaming_sessions/" +
        gamingSessionId
    );
    const response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/gaming_sessions/" +
        gamingSessionId,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          name: gamingSession.description,
          category: gamingSession.activity,
          platform: platform,
          start_time: gamingSession.start_time,
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
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
  try {
    let endpoint = "https://pwntastic.herokuapp.com/api/v2/games?";
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

    let game = games.find(function(game) {
      return game.id === gameId;
    });

    yield put({ type: FETCH_ACTIVITIES_RESULT, game });
  } catch (e) {
    yield put({ type: FETCH_GAMES_ERROR, error: e.message });
  }
}

function* fetchCurrentUser() {
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let endpoint = "https://pwntastic.herokuapp.com/api/v2/users/" + userId;
    yield call(fetchData, endpoint, 1, FETCH_USER_RESULT, FETCH_USER_ERROR);
  } catch (e) {
    yield put({ type: FETCH_USER_ERROR, error: e.message });
  }
}

function* fetchUser() {
  console.log("FETCHING USER");
  try {
    let userId = yield select(state => state.users.userId);
    let endpoint = "https://pwntastic.herokuapp.com/api/v2/users/" + userId;
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
  try {
    yield put({ type: CHANGE_FRIENDS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    // let current_page = yield select(state => state.users.friendsPage);

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" + userId + "/friends?";
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
      "https://pwntastic.herokuapp.com/api/v2/users/" + userId + "/friends?";
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

// function* refreshFriends() {
//   try {
//     let userId = yield select(state => state.authentication.user.user_id);
//     yield put({ type: CHANGE_FRIENDS_PAGE, page: 1 });
//     let new_page = yield select(state => state.users.friendsPage);
//
//     let endpoint =
//       "https://pwntastic.herokuapp.com/api/v2/users/" + userId + "/friends?";
//     yield call(
//       fetchData,
//       endpoint,
//       new_page,
//       FETCH_FRIENDS_RESULT,
//       FETCH_FRIENDS_ERROR,
//       FETCH_FRIENDS_NO_DATA
//     );
//   } catch (e) {
//     yield put({ type: FETCH_FRIENDS_ERROR, error: e.message });
//   }
// }

function* fetchPendingFriends() {
  try {
    yield put({ type: CHANGE_PENDING_FRIENDS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    // let current_page = yield select(state => state.users.friendsPage);

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
      userId +
      "/pending_friends?";
    yield call(
      fetchData,
      endpoint,
      1,
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
    let current_page = yield select(state => state.users.friendsPage);
    yield put({ type: CHANGE_PENDING_FRIENDS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.friendsPage);

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
  try {
    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.users.groupMembersPage);
    yield put({ type: CHANGE_GROUP_MEMBERS_PAGE, page: current_page + 1 });
    let new_page = yield select(state => state.users.groupMembersPage);

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
    let userId = yield select(state => state.authentication.user.user_id);
    yield call(fetchCurrentUser);
    let user = yield select(state => state.users.user);
    let selectedGroupId = yield select(state => state.group.selectedGroupId);
    let endpoint = "";
    if (selectedGroupId == null && user.memberships[0]) {
      endpoint =
        "https://pwntastic.herokuapp.com/api/v2/groups/" +
        user.memberships[0]["group_id"];
      yield call(fetchData, endpoint, 1, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
    } else if (selectedGroupId == null) {
      yield put({ type: FETCH_GROUP_EMPTY });
    } else {
      endpoint =
        "https://pwntastic.herokuapp.com/api/v2/groups/" + selectedGroupId;
      yield call(fetchData, endpoint, 1, FETCH_GROUP_RESULT, FETCH_GROUP_ERROR);
    }
  } catch (e) {
    yield put({ type: FETCH_GROUP_ERROR, error: e.message });
  }
}

function* fetchGamingSession() {
  try {
    let gamingSessionId = yield select(
      state => state.gamingSessions.gamingSessionId
    );

    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/gaming_sessions/" +
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
    yield put({ type: CLEAR_MY_GAMING_SESSIONS });
    yield put({ type: CHANGE_MY_GAMING_SESSIONS_PAGE, page: 1 });

    let userId = yield select(state => state.authentication.user.user_id);
    let current_page = yield select(state => state.search.myGamingSessionsPage);
    let endpoint =
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
      "https://pwntastic.herokuapp.com/api/v2/users/" +
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
function* setCredential() {
  try {
    let userInfo = yield select(state => state.onboarding);
    const response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/users/",
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

        // WORKING HARDCODED PARAMS, USERNAME AND GAMERTAG MUST BE UNIQUE EACH TIME:
        // body: JSON.stringify({
        //   user: {
        //     gamertag: "testing002173",
        //     email: "testing002173@example.com",
        //     password: "test123",
        //     platform: "ps4",
        //     play_style: "casual",
        //     play_schedule: "Weekday Evenings and Weekends",
        //     age: "20",
        //     group_preference: "parents"
        //   }
        // })
      }
    );
    const result = yield response.json();
    if (result.error) {
      // ERROR
    } else {
      token = result.token;
      firebaseToken = result.firebase_token;
      AsyncStorage.setItem("id_token", token);
      // AsyncStorage.setItem("fb_token", firebaseToken);
      yield put({ type: FETCH_TOKEN_RESULT, token, firebaseToken });
    }
  } catch (e) {
    yield put({ type: FETCH_TOKEN_ERROR, error: e.message });
  }
}

function* fetchConversations() {
  try {
    let token = yield select(state => state.authentication.token);

    let response = yield fetch(
      "https://pwntastic.herokuapp.com/api/v2/conversations/",
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
  yield takeEvery(FETCH_TOKEN, fetchToken);
  yield takeEvery(FETCH_TOKEN_RESULT, decodeToken);
  yield takeEvery(DECODE_TOKEN, decodeToken);

  yield takeEvery(REMOVE_TOKEN, removeToken);

  yield takeEvery(UPDATE_USER, updateUser);

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

  yield takeEvery(FETCH_GAMES, fetchGames);

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

  // yield takeEvery(SET_CREDENTIAL, setCredential);

  yield takeEvery(FETCH_CONVERSATIONS, fetchConversations);
}
