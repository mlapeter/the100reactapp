export const SET_PLATFORM = "SET_PLATFORM";
export const SET_GAMERTAG = "SET_GAMERTAG";
export const SET_PROFILE_INFO = "SET_PROFILE_INFO";
export const SET_CREDENTIAL = "SET_CREDENTIAL";
export const SET_USERINFO_ERROR = "SET_USERINFO_ERROR";

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
export const setCredential = (email, password, notificationFlag) => ({
  type: SET_CREDENTIAL,
  email,
  password
});
