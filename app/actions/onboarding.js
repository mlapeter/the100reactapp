export const SET_PLATFORM = "SET_PLATFORM";
export const SET_GAMERTAG = "SET_GAMERTAG";
export const SET_PROFILE_INFO = "SET_PROFILE_INFO";
export const CREATE_USER = "CREATE_USER";
export const CREATE_USER_ERROR = "CREATE_USER_ERROR";

export const setPlatform = platform => ({
  type: SET_PLATFORM,
  platform
});
export const setGamertag = gamertag => ({
  type: SET_GAMERTAG,
  gamertag
});
export const setProfileInfo = (
  timezone,
  playStyle,
  age,
  playSchedule,
  group
) => ({
  type: SET_PROFILE_INFO,
  timezone,
  playStyle,
  age,
  playSchedule,
  group
});
export const createUser = (email, password, tos_privacy_agreement) => ({
  type: CREATE_USER,
  email,
  password,
  tos_privacy_agreement
});
