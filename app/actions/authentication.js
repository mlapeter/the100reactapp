export const FETCH_TOKEN = "FETCH_TOKEN";
export const FETCH_TOKEN_RESULT = "FETCH_TOKEN_RESULT";
export const FETCH_TOKEN_ERROR = "FETCH_TOKEN_ERROR";

export const DECODE_TOKEN = "DECODE_TOKEN";
export const DECODE_TOKEN_RESULT = "DECODE_TOKEN_RESULT";
export const DECODE_TOKEN_ERROR = "DECODE_TOKEN_ERROR";
export const REMOVE_TOKEN = "REMOVE_TOKEN";
export const REMOVE_TOKEN_ERROR = "REMOVE_TOKEN_ERROR";
export const SET_FIREBASE_TOKEN = "SET_FIREBASE_TOKEN";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const RESET_PASSWORD_RESULT = "RESET_PASSWORD_RESULT";
export const RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR";

export const fetchToken = (username, password) => ({
  type: FETCH_TOKEN,
  username,
  password
});

export const decodeToken = token => ({
  type: DECODE_TOKEN,
  token
});

export const removeToken = () => ({
  type: REMOVE_TOKEN
});

export const setFirebaseToken = token => ({
  type: SET_FIREBASE_TOKEN,
  token
});

export const resetPassword = resetPasswordEmail => ({
  type: RESET_PASSWORD,
  resetPasswordEmail
});
