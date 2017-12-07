import {
  SET_PLATFORM,
  SET_GAMERTAG,
  SET_PROFILE_INFO,
  SET_CREDENTIAL,
  SET_USERINFO_ERROR
} from "../actions/onboarding";

const initialState = {
  platform: "",
  gamertag: "",
  timezone: "",
  playStyle: "",
  age: "",
  playSchedule: "",
  group: "",
  email: "",
  password: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLATFORM:
      return {
        ...state,
        platform: action.platform
      };
      break;
    case SET_GAMERTAG:
      return {
        ...state,
        gamertag: action.gamertag
      };
      break;
    case SET_PROFILE_INFO:
      return {
        ...state,
        timezone: action.timezone,
        play_style: action.playStyle,
        age: action.age,
        play_schedule: action.playSchedule,
        group: action.group
      };
      break;
    case SET_CREDENTIAL:
      return {
        ...state,
        email: action.email,
        password: action.password
      };
      break;
    case SET_USERINFO_ERROR:
      return {
        ...state,
        error: action.error,
        platform: "",
        gamertag: "",
        timezone: "",
        play_style: "",
        age: "",
        play_schedule: "",
        group: "",
        email: "",
        password: ""
      };
    default:
      return state;
  }
};
