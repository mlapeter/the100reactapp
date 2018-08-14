import {
  SET_PLATFORM,
  SET_GAMERTAG,
  SET_PROFILE_INFO,
  CREATE_USER,
  CREATE_USER_ERROR
} from "../actions/onboarding";

const initialState = {
  age: "",
  email: "",
  gamertag: "",
  password: "",
  platform: "",
  timezone: "",
  play_schedule: "",
  play_style: "",
  group: "",
  sendNotification: false,
  tos_privacy_agreement: false
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
        age: action.age,
        play_schedule: action.playSchedule,
        play_style: action.playStyle,
        timezone: action.timezone,
        group: action.group
      };
      break;
    case CREATE_USER:
      return {
        ...state,
        email: action.email,
        password: action.password,
        sendNotification: action.sendNotification,
        tos_privacy_agreement: action.tos_privacy_agreement
      };
      break;
    case CREATE_USER_ERROR:
      return {
        ...state,
        error: action.error,
        errorAt: new Date(),
        // platform: "",
        // gamertag: "",
        // timezone: "",
        // play_style: "",
        // age: "",
        // play_schedule: "",
        // group: "",
        // email: "",
        password: ""
      };
    default:
      return state;
  }
};
